import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def test_step2_full_pipeline():
    print("==================================================")
    print("STEP 2: FULL POSTGRESQL CRUD & AUTH SECURITY TEST")
    print("==================================================")
    
    # 1. Register User 1
    user1_data = {
        "full_name": "Dr. Elena Vance",
        "email": f"elena_{id(BASE_URL)}@blackmesa.org",
        "password": "QuantumPassword2026!"
    }
    print(f"\n1. Registering User 1: {user1_data['email']}...")
    reg_resp = requests.post(f"{BASE_URL}/auth/register", json=user1_data)
    assert reg_resp.status_code == 201, f"Registration failed: {reg_resp.text}"
    token1 = reg_resp.json()["access_token"]
    user1_id = reg_resp.json()["user"]["id"]
    headers1 = {"Authorization": f"Bearer {token1}"}
    print(f"   ✓ User 1 registered with ID={user1_id}, JWT issued.")

    # 2. Register User 2 (For Cross-User Authorization Testing)
    user2_data = {
        "full_name": "Gordon Freeman",
        "email": f"gordon_{id(BASE_URL)}@blackmesa.org",
        "password": "CrowbarPassword2026!"
    }
    print(f"\n2. Registering User 2: {user2_data['email']} (for security test)...")
    reg2_resp = requests.post(f"{BASE_URL}/auth/register", json=user2_data)
    assert reg2_resp.status_code == 201, f"User 2 registration failed: {reg2_resp.text}"
    token2 = reg2_resp.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}
    print(f"   ✓ User 2 registered, JWT issued.")

    # 3. Create Business for User 1
    biz_payload = {
        "business_name": "Solaris Rooftop Lounge & Bistro",
        "description": "A premium eco-friendly rooftop dining and artisanal bistro featuring solar-powered energy and panoramic skyline views.",
        "budget": 120000.00,
        "exact_location": "742 Evergreen Terrace, Skyview Tower, Level 18",
        "nearby_places": "Next to Grand Central Station, overlooking City Park and luxury hotel district",
        "equipment_status": "some",
        "equipment_owned": [
            "Commercial Espresso Machine",
            "POS Terminal & Receipt Printer",
            "Commercial Refrigeration Unit",
            "Solar Induction Cooktop Range"
        ]
    }
    print(f"\n3. Creating Business for User 1: '{biz_payload['business_name']}'...")
    create_resp = requests.post(f"{BASE_URL}/businesses", json=biz_payload, headers=headers1)
    assert create_resp.status_code == 201, f"Business creation failed: {create_resp.text}"
    biz = create_resp.json()
    biz_id = biz["id"]
    print(f"   ✓ Business created with ID={biz_id}, user_id={biz['user_id']}, status='{biz['status']}'")
    assert biz["user_id"] == user1_id, "Owner user_id mismatch!"
    assert float(biz["budget"]) == 120000.00, "Budget mismatch!"
    assert biz["equipment_status"] == "some", "Equipment status mismatch!"
    assert len(biz["equipment_owned"]) == 4, "Equipment owned list mismatch!"

    # 4. List Businesses for User 1
    print(f"\n4. Listing businesses for User 1 (GET /api/businesses)...")
    list_resp = requests.get(f"{BASE_URL}/businesses", headers=headers1)
    assert list_resp.status_code == 200, f"List failed: {list_resp.text}"
    user1_businesses = list_resp.json()
    assert any(b["id"] == biz_id for b in user1_businesses), "Created business not found in User 1 list!"
    print(f"   ✓ Found {len(user1_businesses)} business(es) for User 1.")

    # 5. Verify User 2 CANNOT see User 1's business
    print(f"\n5. Verifying User 2 cannot see User 1's business in their list...")
    list2_resp = requests.get(f"{BASE_URL}/businesses", headers=headers2)
    assert list2_resp.status_code == 200
    user2_businesses = list2_resp.json()
    assert not any(b["id"] == biz_id for b in user2_businesses), "SECURITY BREACH: User 2 sees User 1 business!"
    print(f"   ✓ Security verified: User 2 list is completely isolated (0 results).")

    # 6. Fetch Business by ID for User 1
    print(f"\n6. Fetching Business #{biz_id} by ID for User 1 (GET /api/businesses/{biz_id})...")
    get_resp = requests.get(f"{BASE_URL}/businesses/{biz_id}", headers=headers1)
    assert get_resp.status_code == 200, f"Get business failed: {get_resp.text}"
    fetched = get_resp.json()
    assert fetched["business_name"] == biz_payload["business_name"]
    print(f"   ✓ Business #{biz_id} retrieved successfully.")

    # 7. Verify User 2 CANNOT fetch User 1's business by ID (404/Forbidden)
    print(f"\n7. Verifying User 2 CANNOT fetch User 1's Business #{biz_id} directly...")
    unauth_get = requests.get(f"{BASE_URL}/businesses/{biz_id}", headers=headers2)
    assert unauth_get.status_code == 404, f"Expected 404 for unauthorized access, got {unauth_get.status_code}"
    print(f"   ✓ Security verified: User 2 received 404 Not Found.")

    # 8. Update Business (PUT /api/businesses/{biz_id})
    update_payload = {
        "business_name": "Solaris Eco Rooftop Lounge & Bistro",
        "budget": 135000.00
    }
    print(f"\n8. Updating Business #{biz_id} for User 1 (PUT /api/businesses/{biz_id})...")
    update_resp = requests.put(f"{BASE_URL}/businesses/{biz_id}", json=update_payload, headers=headers1)
    assert update_resp.status_code == 200, f"Update failed: {update_resp.text}"
    updated = update_resp.json()
    assert updated["business_name"] == "Solaris Eco Rooftop Lounge & Bistro"
    assert float(updated["budget"]) == 135000.00
    print(f"   ✓ Business updated: Name='{updated['business_name']}', Budget=${float(updated['budget']):,.2f}")

    # 9. Verify User 2 CANNOT update User 1's business
    print(f"\n9. Verifying User 2 CANNOT update User 1's business...")
    unauth_put = requests.put(f"{BASE_URL}/businesses/{biz_id}", json={"business_name": "Hacked"}, headers=headers2)
    assert unauth_put.status_code == 404
    print(f"   ✓ Security verified: User 2 cannot modify User 1 business.")

    # 10. Delete Business (DELETE /api/businesses/{biz_id})
    print(f"\n10. Deleting Business #{biz_id} for User 1 (DELETE /api/businesses/{biz_id})...")
    del_resp = requests.delete(f"{BASE_URL}/businesses/{biz_id}", headers=headers1)
    assert del_resp.status_code == 200, f"Delete failed: {del_resp.text}"
    print(f"   ✓ Business #{biz_id} deleted successfully.")

    # 11. Verify Business is no longer retrievable
    verify_del = requests.get(f"{BASE_URL}/businesses/{biz_id}", headers=headers1)
    assert verify_del.status_code == 404, "Deleted business still accessible!"
    print(f"   ✓ Confirmed: Business #{biz_id} returns 404 after deletion.")

    print("\n==================================================")
    print("ALL 11 POSTGRESQL CRUD & AUTH SECURITY TESTS PASSED! ✅")
    print("==================================================")

if __name__ == "__main__":
    test_step2_full_pipeline()
