from flask import Flask, render_template
import re
from autocorrect import Speller

app = Flask(__name__)
spell = Speller(lang='en')

def reduce_lengthening(text):
    pattern = re.compile(r"(.)\1{2,}")
    return pattern.sub(r"\1\1", text)

@app.route('/check/<string:name>')
def check(name):
    name = reduce_lengthening(name)
    return spell(name)

if __name__ == '__main__':
    app.run(debug=True)