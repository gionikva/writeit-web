var interval;

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



window.addEventListener("load", () => {
    console.log("WORKING");
    const textarea_old = document.getElementsByTagName("textarea").item(0);
    const rect = textarea_old.getBoundingClientRect();
    const textarea = textarea_old.cloneNode();
    const parentTextarea = textarea_old.parentElement;
    // parentTextarea.removeChild(textarea);
    const wrapper = document.createElement('div');
    const overlay = document.createElement('div');
    const highlights = document.createElement('div');
    highlights.className = "writeit-highlights";
    overlay.className = "writeit-highlight-overlay";
    overlay.appendChild(highlights);

    wrapper.className = "writeit-textarea-wrapper";
    wrapper.appendChild(overlay);
    console.log("Contains? " + parentTextarea.contains(textarea_old));
    console.log(wrapper);
    console.log(textarea_old.toString() + 'wrapper: ' + wrapper.toString());
    textarea_old.replaceWith(wrapper);
    wrapper.appendChild(textarea);
    
    var $container = $('.writeit-textarea-wrapper');
    var $backdrop = $('.writeit-highlight-overlay');
    var $highlights = $('.writeit-highlights');
    var $textarea = $('textarea');
    // var $toggle = $('button');

    // yeah, browser sniffing sucks, but there are browser-specific quirks to handle that are not a matter of feature detection
    var ua = window.navigator.userAgent.toLowerCase();
    var isIE = !!ua.match(/msie|trident\/7|edge/);
    var isWinPhone = ua.indexOf('windows phone') !== -1;
    var isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);
    var suggestions = [];
    interval = setInterval(() => pollHighlights(), 1000);

    async function pollHighlights()  {
        var text = $textarea.val();
        if (text) {
            const resp = await fetch('/check/' + text);
            console.log("Resp", resp);
            const json = await resp.json();
            console.log("Json", json);
            var highlightedText = applyHighlights(text,  Array.from(Object.values(json.corrected_words)));
            $highlights.html(highlightedText);
        } else {
            var highlightedText = applyHighlights(text, []);
        }
        // applyHighlights();
    }

    function applyHighlights(text_, suggestions) {

        if (suggestions.length == 0) { return '' };
        var text = `${text_}`;
        var offset = 0;
        for (const suggestion of suggestions) {
            var diff = '<div class="highlight"></div>'.length;
            var bef = text.slice(0, suggestion.index[0] + offset);
            var aft = text.slice(suggestion.index[1] + offset);
            text = bef + `<div class="highlight">${suggestion.initial}</div>` + aft;
            offset += diff;
        }
        
        // text = text
        //     .replace(/\n$/g, '\n\n')
        //     .replace(/[A-Z].*?\b/g, '<div class="highlight">$&</div>');

        if (isIE) {
            text = text.replace(/ /g, ' <wbr>');
        }

        return text;
    }


    function handleInput() {
        var text = $textarea.val();
        // var highlightedText = applyHighlights(text);
        // $highlights.html(highlightedText);
    }

    function handleScroll() {
        console.log("Handling scroll");
        console.log($backdrop.scrollTop);
        var scrollTop = $textarea.scrollTop();
        // $backdrop.scrollTop(scrollTop);
        console.log(scrollTop);
        highlights.style.top = -scrollTop +10 + "px";
        // console.log(scrollTop);

        var scrollLeft = $textarea.scrollLeft();
        $backdrop.scrollLeft(scrollLeft);
    }

    function fixIOS() {
        // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
        $highlights.css({
            'padding-left': '+=3px',
            'padding-right': '+=3px'
        });
    }

    function bindEvents() {
        $textarea.on({
            'input': handleInput,
            'scroll': handleScroll
        });
    }

    if (isIOS) {
        fixIOS();
    }

    bindEvents();
    handleInput();
})