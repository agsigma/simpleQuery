var simpleQuery = (function() {
    var simpleQuery = function(selectorOrElems) {
        return new CSimpleQuery(selectorOrElems);
    };
    var find = function(elems, selector) {
        var res = [];
        // console.log('Find: ', elems, selector);
        return Array.from(elems).reduce(function(memo, elem) {	                       
            return memo.concat(Array.from(elem.querySelectorAll(selector)));			
        }, []);
    }
    var create = function(string) {
        var el;
        el = document.createElement('div');
        el.innerHTML = string; 
        return el.childNodes;
    }    
    // stable, n^2
	var unique = function(array) {
		var res = [];
		array.forEach(function(el) {
			var isDup = false;
			res.forEach(function(resEl) {
				if (resEl == el) {
					isDup = true;
				}
			});
			isDup || res.push(el);
		});
		return res;
	};	
    simpleQuery.fn =  {
        'find' : function(selector) {
            return new simpleQuery(unique(find(this.elems, selector)))
        },
        'addClass' : function(className) {
            this.elems.forEach(function(el) {
                // console.log(el);
                className.split(/\s+/).forEach(function(cN) {
                    el.classList.add(cN);
                });
            })
            return this;
        },        
        'removeClass' : function(className) {
            this.elems.forEach(function(el) {
                // console.log(el);
                className.split(/\s+/).forEach(function(cN) {
                    el.classList.remove(cN);
                });
            })
            return this;
        },
        'attr' : function(name, value) {
            //alert('name: ' + name + " : " + typeof(value));
            if (typeof(value) == 'undefined') {
                // alert('value: ' + value);
                return (!!this.elems.length ? this.elems[0].getAttribute(name) : undefined);
            }
            this.elems.forEach(function(el) {
                // console.log(el);
                el.setAttribute(name, value);
            })
            return this;
        },
        'removeAttr' : function(name) {
            this.elems.forEach(function(el) {
                // console.log(el);
                el.removeAttribute(name);
            })
            return this;
        },
        'create' :function(string) {            
            return simpleQuery(create(string));            
        },
        'append' : function(sQElem) {       
            // console.log('APPEND: ', this, sQElem);
            this.each(function(index, el) {
                sQElem.each(function(index, appendedEl) {
                    el.appendChild(appendedEl.cloneNode(true));                    
                    // console.log('append: ', el, appendedEl);
                });                                
            })
            return this;
        },
        'prepend' : function(sQElem) {                      
            this.elems.forEach(function(el) {
                sQElem.elems.forEach(function(appendedEl) {
                    if (el.childNodes.length == 0) {
                        el.appendChild(appendedEl);
                    } else {
                        el.insertBefore(appendedEl.cloneNode(true), el.firstChild);
                    }
                });                                
            })
            return this;
        },
        'html' : function(string) {
			if (arguments.length) {
				this.elems.forEach(function(el) {
					el.innerHTML = string;                
				})
				return this;
			} else {
				return this.elems.length ? this.elems[0].innerHTML : undefined;
			}
        },
        'each' : function(callback) {
            this.elems.forEach(function(el, index) {
                callback.apply(el, [index, el]);
            });
        },
        'remove' : function() {
            var res = [];
            this.elems.forEach(function(el) { 
                var parent = el.parentNode;
                // console.log(el, parent);
                if (!!parent) {
                    res.push(parent.removeChild(el));
                }
            });
            return simpleQuery(res);
        },
        'first' : function() {
			return this.eq(0);
            // return simpleQuery(this.elems.length ? this.elems[0] : []);
        },
        'last' : function() {
			return this.eq(this.elems.length-1);
            // return simpleQuery(this.elems.length ? this.elems[this.elems.length-1] : []);
        },
        'eq' : function(n) {
			if (n < 0 || n >= this.elems.length || !this.elems.length) {
				return simpleQuery([]);
			} else {
				return simpleQuery(this.elems[n]);
			}
        },
        'size' : function() {
            return this.elems.length;
        },
        'empty' : function() {
            this.each(function(index, el) {
                el.innerHTML = null;
            })
        },
        'bind' : function(eventName, callback) {
            callback = callback || function() {};
            this.each(function(index, el) {
                el.addEventListener(eventName, callback.bind(this));
            });
            return this;
        },
        'click' : function(callback) {
            this.bind('click', callback);
            return this;
        },
        'val' : function(value) {
            var res, k;
            if (arguments.length == 0) {
                for (k in this.elems) {
                    console.log('val: ', k, this.elems[k], this.elems[k].value,  this.elems[k].hasOwnProperty('value'))
                    if (typeof(this.elems[k].value) != 'undefined' || this.elems[k].hasOwnProperty('value')) {
                        console.log('val:res -> ', this.elems[k].value ? this.elems[k].value : "");
                        return this.elems[k].value ? this.elems[k].value : "";
                    }
                }
                console.log('val:res -> ', "");
                return "";
            }
            
            this.each(function(index, el) {
                console.log('val', el, el.value);
                if (el.hasOwnProperty('value')) { /*powinno byc hasProperty */
                    el.value = String(value);       
                }
            });            
            // alert('val');
            return this;
        },
        'css': function(name, prop) {
            // dodac konwersje na camelCase            
            var k;
            if (arguments.length == 1) {
                return this.elems.length ? this.elems[0].style[name] : null;
            } else if (arguments.length == 2) {
                // ustawianie
                this.each(function() {
					this.style[name] = prop;
				});
				return this;
            }
        },
        'toArray' : function() {
            return this.elems;
        }
    }
    var CSimpleQuery = function(selectorOrElems) {  
        if (typeof(selectorOrElems) == "string") {
            selectorOrElems = selectorOrElems.trim();
        }
        // console.log('1: ', selectorOrElems);        
        if (typeof(selectorOrElems) == 'string' && selectorOrElems[0] != "<") {
            this.elems = [document];    
            this.elems = find(this.elems, selectorOrElems)
        } else if (selectorOrElems instanceof Node) {
            this.elems = [selectorOrElems];
        } else if (typeof(selectorOrElems) == 'string' && selectorOrElems[0] == "<") { // stringi            
            this.elems = Array.from(create(selectorOrElems));
        } else {
            this.elems = Array.from(selectorOrElems);
        }
        // console.log('2: ', selectorOrElems, this.elems);    
    }       
    CSimpleQuery.prototype = simpleQuery.fn;        
	Object.defineProperty(CSimpleQuery.prototype, 'length', {
		'enumerable' : true,
		'configurable' : false,		
		'get' : function() {
			return this.elems.length;
		}
	});
    return simpleQuery;
})();
