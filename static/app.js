document.getElementById('polish-button').addEventListener('mouseup', async () => {
    const textarea = document.getElementsByTagName('textarea').item(0);
    var text = textarea.value;
    const resp = await fetch('/check/' + text);
    console.log("Resp", resp);
    const json = await resp.json();
    console.log("Json", json);

    const suggestions = json.corrected_words;
    
    var offset = 0;
    for (const suggestion of Object.values(suggestions)) {
        var diff = suggestion.corrected.length - suggestion.initial.length;
        var bef = text.slice(0, suggestion.index[0] + offset);
        var aft = text.slice(suggestion.index[1] + offset);
        text = bef + suggestion.corrected + aft;
        offset += diff;
        // [ { index: [start, end] } ]
    }
    textarea.value = text;
})