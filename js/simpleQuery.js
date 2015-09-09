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
            var dontClone = true;
            // console.log('APPEND: ', this, sQElem);
            this.each(function(index, el) {                
                sQElem.each(function(index, appendedEl) {
                    var node = !!dontClone ? appendedEl : appendedEl.cloneNode(true);
                    el.appendChild(node);                                        
                    // console.log('append: ', el, appendedEl);
                });                        
                dontClone = false;                
            })
            return this;
        },
        'prepend' : function(sQElem) {                      
            var dontClone = true;
            this.elems.forEach(function(el) {
                sQElem.elems.forEach(function(appendedEl) {
                    var node = !!dontClone ? appendedEl : appendedEl.cloneNode(true);                    
                    if (el.childNodes.length == 0) {
                        el.appendChild(node);
                    } else {
                        el.insertBefore(node, el.firstChild);
                    }
                });                                
                dontClone = false;
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
                el.innerHTML = "";
            })
        },        
        // if returnHandlers is true, function returns modified handlers array instead of sQ object        
        'bind' : function(eventName, callback, optThis, returnHandlers) {
			var handlers = [];
            callback = callback || function() {};
            this.each(function(index, el) {
				handlers.push(function() { 
					return callback.apply(optThis || this, arguments); 
				});
                el.addEventListener(eventName, handlers[handlers.length-1], false);
            });
            return !!returnHandlers ? handlers : this;
        },
        'unbind' : function(eventName, handlers) {
			if (typeof(handlers) == "function") { // is function, not array of function
				handlers = [handlers];
			}
			this.each(function(index, el) {				
				handlers.forEach(function(handler) {
					el.removeEventListener(eventName, handler, false);
					console.log(el, eventName, handler, el.removeEventListener(eventName, handler, false));
				}, this);
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
                    // console.log('val: ', k, this.elems[k], this.elems[k].value,  this.elems[k].hasOwnProperty('value'))
                    if (typeof(this.elems[k].value) != 'undefined' || this.elems[k].hasOwnProperty('value')) {
                        // console.log('val:res -> ', this.elems[k].value ? this.elems[k].value : "");
                        return this.elems[k].value ? this.elems[k].value : "";
                    }
                }
                // console.log('val:res -> ', "");
                return "";
            }
            
            this.each(function(index, el) {
                // console.log('val', el, el.value);
                if (el.hasOwnProperty('value')) {
                    el.value = String(value);       
                }
            });            
            // alert('val');
            return this;
        },
        'css': function(name, prop) {
            // dodac konwersje na camelCase            
            var k, propsObj = {};            
            if (arguments.length == 1 && typeof(arguments[0]) == 'string') {
                return this.elems.length ? this.elems[0].style[name] : null;
            } else {				
				if (arguments.length == 2) {					
					propsObj[arguments[0]] = arguments[1];
				} else {
					propsObj = name;
				}
                // ustawianie                
                for (k in propsObj) {					
					this.each(function() {						
						this.style[k] = propsObj[k];
						if (propsObj[k] === false) {
							this.style.removeProperty(k);
						}
					});
				}
                return this;
            }
        },
        'toArray' : function() {
            return this.elems;
        }
    }
    // tylko jsonp, tylko parametry w gecie    
    simpleQuery.ajax = function(options) {
        var url = options.url, data = options.data || {};
        var callback, callbackName, success, error, timeout, k, query = "", script, rejectClock;        
        
        callbackName = data.callback = data.callback || 'jsonp' + simpleQuery.ajax.uniqId();                   
        success = options.success || function() {};
        error = options.error || function() {};
        timeout = options.timeout || 1000 * 15;
        
        for (k in data) {
            query += encodeURIComponent(k) + "=" + encodeURIComponent(data[k]) + "&";
        }
        query = query.substr(0, query.length-1);        
        window[callbackName] = function(data){
            clearTimeout(rejectClock);
            success(data);      
        }
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url + "?" + query;
        sQ('head').first().append( sQ(script) );
        sQ(script).remove();
        rejectClock = setTimeout(function() {
            error();
        }, timeout);        
    }
    simpleQuery.ajax._uniqId = Math.floor(Math.random()*1000000)+'';
    simpleQuery.ajax.uniqId = function() { return simpleQuery.ajax._uniqId++;};
    
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
