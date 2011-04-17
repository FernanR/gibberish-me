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
        
        for (i = 0; i <= wordlist.length - this.numPrefix; i = i + 1) {
            preflist = [];
            for (j = 0 + i; j < this.numPrefix + i; j = j + 1) {
                preflist.push(wordlist[j]);
            }  
            suffix = wordlist[(i*this.numPrefix) + 2];
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
            for (j = 0; j < this.numPrefix; j = j + 1) {
                if (this.gibberTable[i][j] !== preflist[j]) {
                    break;
                } 
                window.document.writeln(this.gibberTable[i][j] + ":" + preflist[j]);
                // executed if the row is a match
                this.gibberTable[i].push(suffix);
            }
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
    
    
    // returns the prefix without the first word
    removePrefix: function (prefix) {
        var spaceIndex;
        spaceIndex = prefix.indexOf(" ");
        prefix = prefix.substring(spaceIndex);
        return prefix;
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
    }
};

var test = "I stand here today humbled by the task before us, grateful for the trust you have bestowed, mindful of the sacrifices borne by our ancestors. I thank President Bush for his service to our nation, as well as the generosity and cooperation he has shown throughout this transition. Forty-four Americans have now taken the presidential oath. The words have been spoken during rising tides of prosperity and the still waters of peace. Yet, every so often, the oath is taken amidst gathering clouds and raging storms. At these moments, America has carried on not simply because of the skill or vision of those in high office, but because We the People have remained faithful to the ideals of our forbearers, and true to our founding documents. So it has been. So it must be with this generation of Americans. That we are in the midst of crisis is now well understood. Our nation is at war, against a far-reaching network of violence and hatred. Our economy is badly weakened, a consequence of greed and irresponsibility on the part of some, but also our collective failure to make hard choices and prepare the nation for a new age. Homes have been lost; jobs shed; businesses shuttered. Our health care is too costly; our schools fail too many; and each day brings further evidence that the ways we use energy strengthen our adversaries and threaten our planet. These are the indicators of crisis, subject to data and statistics. Less measurable but no less profound is a sapping of confidence across our land--a nagging fear that America's decline is inevitable, and that the next generation must lower its sights. Today, I say to you that the challenges we face are real. They are serious and they are many. They will not be met easily or in a short span of time.";
var gm = new GibberishMe(test, 2);
gm.makeGibberTable();
var i;
for (i = 0; i < gm.gibberTable.length; i = i + 1) {
    window.document.writeln(gm.gibberTable[i]);
    window.document.writeln("****");
}
//var out = gm.generateGibberish(200);
//window.document.writeln(out);

