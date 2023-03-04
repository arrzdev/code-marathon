from strsimpy.cosine import Cosine

def similarity_score(string, city_codes):
  bdata = {}
  bscore = float("-inf")
  cosine = Cosine(2)

  for city_data in city_codes:
    city_name = city_data["city"]

    if "*" in city_name:
      city_name = city_name.split("*")[0]

    score = cosine.similarity(string, city_name)

    if score > bscore:
      bscore = score
      bdata = {
        "name": city_name,
        "code": city_data["shorthand"],
      }

  if bscore < 0.5:
    return {
      "status": "error",
      "error": "No city found"
    }

  return {
    "status": "success",
    "data": bdata
  }
  