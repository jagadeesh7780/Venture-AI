import urllib.request
import json

key = 'AIzaSyAtc6KyR6cnnSjvf4o_zcNfzcWZF0ob0Vo'
url = 'https://places.googleapis.com/v1/places:searchText'
headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': key,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount'
}
data = json.dumps({'textQuery': 'boutique in Tenali'}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode('utf-8'))
        print(f"Found {len(result.get('places', []))} real places in Tenali!")
        for idx, p in enumerate(result.get('places', [])[:6]):
            name = p.get('displayName', {}).get('text')
            addr = p.get('formattedAddress')
            loc = p.get('location')
            rating = p.get('rating', 'N/A')
            reviews = p.get('userRatingCount', 0)
            print(f"[{idx+1}] {name} | Rating: {rating} ({reviews} reviews) | Lat: {loc.get('latitude')}, Lng: {loc.get('longitude')}")
except Exception as e:
    print("Error:", e)
