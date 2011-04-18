/*global window: false */

/**
 *   gibberish.js an implementation of the Markov chain algorithm in javascript.
 *   it generates gibberish text.
 * 
 *   Copyright (C) 2011  Ben Scholz
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


var GibberishMe = function (inputText, nPrefix) {
    this.inText = inputText;
    this.numPrefix = nPrefix;
    this.gibberTable = [];
};

GibberishMe.prototype = {

    generateGibberish: function (numWords) {
        var i, prefix, suffix, output;
        
        prefix = this.getPrefix();
        suffix = this.getSuffix(prefix);
        
        output = prefix + " " + suffix + " ";
        
        prefix = this.removePref(prefix) + suffix;
        
        for (i = 0; i < numWords; i = i + 1) {

            if (this.getSuffix(prefix) !== false) {
                suffix = this.getSuffix(prefix);
                output = output + suffix + " ";
                prefix = this.removePrefix(prefix) + suffix;
            } else {
                prefix = this.getPrefix();
                output = output + ". " + prefix;
            }
        }
        return output;
    },


    // constructs an array of arrays where each internal array consists of the
    // suffixes following a two word prefix.
    makeGibberTable: function () {
        var i, j, k, suflist, wordlist, preflist, suffix;
        
        wordlist = this.inText.split(" ");
        preflist = [];
        
        for (i = 0; i <= wordlist.length - this.numPrefix; i = i + 1) {
            for (j = 0 + i; j < this.numPrefix + i; j = j + 1) {
                preflist.push(wordlist[j]);
            }  
            suffix = wordlist[i + this.numPrefix];
            this.gibberTableInsert(preflist, suffix);
            preflist = [];
        }
    },
    
    
    gibberTableInsert: function (preflist, suffix) {
        var i, j, ismatch;

        if (this.gibberTable.length === 0) {
            this.entryPush(preflist, suffix);
            return;
        }
        for (i = 0; i < this.gibberTable.length; i = i + 1) {
            for (j = 0; j < this.numPrefix; j = j + 1) {
                if (this.gibberTable[i][j] === preflist[j]) {
                    ismatch = true;
                } else {
                    ismatch = false;
                    break;
                }
            }
            if (ismatch) {
                this.gibberTable[i].push(suffix);
                return;
            } else if (i === this.gibberTable.length - 1) {   
                this.entryPush(preflist, suffix);
                return;
            }
        }
    },
    
    
    entryPush: function (preflist, suffix) {
        var i, entry;
        entry = [];
        for (i = 0; i < preflist.length; i = i + 1) {
            entry.push(preflist[i]);
        }
        entry.push(suffix);
        this.gibberTable.push(entry);
    },
    
    
    // returns the prefix without the first word
    removePrefix: function (prefix) {
        var spaceIndex;
        spaceIndex = prefix.indexOf(" ");
        prefix = prefix.substring(spaceIndex);
        return prefix;
    },
    
    
    // takes an entry in the table (n prefixes + suffix) and returns a prefix string
    listToPrefix: function (preflist) {
        var i, list, prefixComp;
        list = [];
        
        for (i = 0; i < (preflist.length - this.numPrefix); i = i + 1) {
            list.push(preflist[i]);
        }
        prefixComp = list.join(" ");
        return prefixComp;
    },
    
    
    // returns a random suffix for a given prefix
    getSuffix: function (prefix) {
        var i, j, preflist, prefixComp, randIndex;
        
        for (i = 0; i < this.gibberTable.length; i = i + 1) {
            preflist = this.gibberTable[i];
            prefixComp = this.listToPrefix(preflist);
            if (prefixComp === prefix) {
                for (;;) {
                    randIndex = Math.round(Math.random()*(this.gibberTable[i].length - 1));
                    if (randIndex >= this.numPrefix) {
                        return this.gibberTable[i][randIndex];
                    } 
                }
            } else if (i === this.gibberTable.length - this.numPrefix) {
                return false;
            }
        } 
    },
    
    
    getPrefix: function () {
        var randIndex, i, preflist;
        preflist = [];
        
        for (;;) {
            randIndex = Math.round(Math.random()*(this.gibberTable.length-1));
            if (this.gibberTable[randIndex][0].charAt(0).toUpperCase() === 
                this.gibberTable[randIndex][0].charAt(0)) {
                for (i = 0; i < this.numPrefix; i = i + 1) {
                    preflist.push(this.gibberTable[randIndex][i]);
                }
                return preflist.join(" ");
            }
        }   
    }
};

var test = "Show your flowcharts and conceal your tables, and I will be mystified. Show your tables and your flowcharts will be obvious.";
var gm = new GibberishMe(test, 2);
gm.makeGibberTable();
//var i;
//for (i = 0; i < gm.gibberTable.length; i = i + 1) {
//    window.document.writeln(gm.gibberTable[i]);
//    window.document.writeln("****");
//}
//window.document.writeln(gm.getPrefix());
//var out = gm.generateGibberish(200);
//window.document.writeln(out);

