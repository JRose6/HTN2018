"""
Takes text to analyse
Returns 5D vector where each dimention {0,1}
[saddness, joy, fear, disgust, anger]
"""
def get_sentiment(target_text):
	from watson_developer_cloud import NaturalLanguageUnderstandingV1
	from watson_developer_cloud.natural_language_understanding_v1 \
	import Features, EntitiesOptions, KeywordsOptions

	natural_language_understanding = NaturalLanguageUnderstandingV1(
	 username="f3d8e76b-d1b4-4a6e-9a7c-775f2d26170c",
	 password="FtXwkf1NJH1Z",
	 version="2018-03-16")

	""" Opening the file and reading the text contained """
	file = open("messages_to_be_analyzed.txt",'r')
	target_text = file.read()

	response = natural_language_understanding.analyze(
	 text= target_text,
	 features=Features(
	   entities=EntitiesOptions(
	     emotion=True,
	     sentiment=True,
	     limit=2),
	   keywords=KeywordsOptions(
	     emotion=True,
	     sentiment=True,
	     limit=2)))

	return [response.result.get("keywords")[0].get("emotion").get(emotion) for emotion in
		[entry for entry in response.result.get("keywords")[0].get("emotion")]]
