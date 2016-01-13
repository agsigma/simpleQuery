# simpleQuery
### slow, ugly, experimental, not optimized 
### DON'T USE IT

Replacement of basic jQuery functions for modern browsers. Very very alpha - don’t use in any serious project unless you read the code.

### Example
```javascript
(function($){    
    $.fn.changeHref = function() {
        this.each(function(i) {
            $(this).attr('href', 'http://github.com/agsigma/');
            $(this).append($('<span>!' + i + '!</span>').css('color', '#AA3333'));
        });
        return this;
  };
})(sQ);        

sQ('div div').find('a').changeHref().css('textDecoration', 'underline');
```

### sQ.fn.find 
Can seriously hurt performance of your code, with worst case complexity as bad as (number_of_element)^(number_of_finds_used), eg.:
```javascript
sQ('div').find('div').find('div').find('div')
```
to make it worse it doesn’t remove duplicates so:
```javascript
sQ('div').find('div').find('div').find('div').append(sQ('<span>BLA</span>'));
```
is a disaster (in other words: don’t use find until code gets fixed).

Bind got fixed. But it still works in O(n^2), where n is number of nodes in selection, so use with caution until gets rewritten to use Set.

### sQ.fn.append
Clone nodes being appended so all event handlers are lost in process.

### sQ.fn.css
camelCase must be used in names passed to sQ.fn.css.

### sQ.ajax
Not ajax. Just JSONP passing all parameters in GET. Available option:
```javascript
{
    url: 'http://someapiaddress.com', // url 
    success: function(data) { alert(JSON.stringify(data)); }, //callback 
    error: function() { alert(error); }, // callback, 
    timeout: 5000, // miliseconds
    data: { name: 'noname' } //params
}
```

### sQ.fn.bind, sQ.fn.unbind
Those are actually pretty good... but not tested.

### Browsers support
It requires polyfills to work in any browser(September 2015).

### Good parts
The only good thing I can say about it is that you can throw simpleQuery object out of the window and replace with jQuery - functions definitions are the same.

### Examples
Can be found in examples directory and in qunit/index.htm.
