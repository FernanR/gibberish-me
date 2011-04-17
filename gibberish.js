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
                prefix = this.removePref(prefix) + suffix;
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
        var i, j, suflist, wordlist, preflist, suffix;
        
        wordlist = this.inText.split(" ");

        for (i = 0; i <= wordlist.length - this.numPrefix; i = i + 1) {
            preflist = [];
            for (j = 0; j < this.numPrefix; j = j + 1) {
                preflist[j] = wordlist[i];
            }
            suffix = wordlist[i + this.numPrefix-1];

            this.gibberTableInsert(preflist, suffix);
        }   

    },
    
    
    gibberTableInsert: function (preflist, suffix) {
        var i, j;

        if (this.gibberTable.length === 0) {
            this.entryPush(preflist, suffix);
            return;
        }
        for (i = 0; i < this.gibberTable.length; i = i + 1) {
            for (j = 0; j < preflist.length; j = j + 1) {
                if (this.gibberTable[i][j] !== preflist[j]) {
                    break;
                } 
            }
            // executed if the row is a match
            this.gibberTable[i].push(suffix);
        }
        if (i === this.gibberTable.length - 1) {    
            this.entryPush(preflist, suffix);
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
    
    
    getSuffix: function (prefix) {
        var i, prefixA, prefixB, prefixComp, randIndex;
        
        for (i = 0; i < this.gibberTable.length - 1; i = i + 1) {
            prefixA = this.gibberTable[i][0];
            prefixB = this.gibberTable[i][1];
            prefixComp = prefixA + " " + prefixB;
            if (prefixComp === prefix) {
                for (;;) {
                    randIndex = Math.round(Math.random()*(this.gibberTable[i].length - 1));
                    if (randIndex >= 2) {
                        return this.gibberTable[i][randIndex];
                    }
                }
            } else if (i === this.gibberTable.length - 2) {
                return false;
            }
        }   
    },
    
    
    getPrefix: function () {
        var randIndex, prefix;
        
        for (;;) {
            randIndex = Math.round(Math.random()*(this.gibberTable.length-1));

            if (this.gibberTable[randIndex][0].charAt(0).toUpperCase() === 
                this.gibberTable[randIndex][0].charAt(0)) {
                return this.gibberTable[randIndex][0] + " " + this.gibberTable[randIndex][1];
            }
        }   
    },
    
    
    // returns the prefix without the first word
    removePref: function (pref) {
        //remove the first word of the prefix
        var i, prefix;
        prefix = "";
        for (i = 1; i < this.numPrefix; i = i + 1) {
            prefix = prefix + pref.split(" ")[i] + " ";
        }
        return prefix;
    }
};

var test = "Show your flowcharts and conceal your tables, and I will be mystified. Show your tables and your flowcharts will be obvious.";
var gm = new GibberishMe(test, 2);
gm.makeGibberTable();
var i;
for (i = 0; i < gm.gibberTable.length; i = i + 1) {
    window.document.writeln(gm.gibberTable[i]);
    window.document.writeln("****");
}
//var out = gm.generateGibberish(200);
//window.document.writeln(out);

