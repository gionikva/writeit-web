from flask import Flask, render_template, jsonify
import re
from autocorrect import Speller

app = Flask(__name__)
spell = Speller(lang='en')

def remove_punctuation(text): #Function to remove punctuation from a string
    return re.sub(r'[^\w\s]','',text)

def reduce_lengthening(text):
    pattern = re.compile(r"(.)\1{2,}")
    return pattern.sub(r"\1\1", text)

@app.route('/check/<string:name>')
def check(name):
    print(name)
    #First we need to split the paragraph into words and remove the punctuation
    words = remove_punctuation(name).split()
    #Then we need to correct the spelling of each word
    words = [reduce_lengthening(word) for word in words]
    corrected_words = []
    index = []
    orig_words = []
    words_dict = {}
    count = 0
    print(words)
    for word in words:
        test = reduce_lengthening(word)
        if spell(test) != word:
            count += 1
            orig_words.append(word)
            corrected_words.append(spell(test))
            index.append((name.find(word), (name.find(word) + len(word))))
            words_dict[count] = {'initial': word, 'corrected': spell(test), 'index': (name.find(word), (name.find(word) + len(word)))}
    resp = {
        "description":"wrong spelling",
        'corrected_words': words_dict
    }
    return jsonify(resp)

if __name__ == '__main__':
    app.run(debug=True)

# resp = {
# "initial":"rusia",
# "description":"wrong spelling",
# "suggestions":["russia"],
# "wordstart":0,
# "wordend":4}