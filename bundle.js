(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*
TypeFic interactive fiction framework
Designed and developed by Benny Mattis.

The MIT License:

Copyright 2023 Benny Mattis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeFic = void 0;
var TypeFic = /** @class */ (function () {
    function TypeFic(startingState) {
        this.gameState = __assign(__assign({}, startingState), { gameOver: false, currentVariables: {} });
        if ('bookVariables' in this.gameState.currentBook) {
            for (var variable in this.gameState.currentBook.bookVariables) {
                this.gameState.currentVariables[variable] = this.gameState.currentBook.bookVariables[variable];
            }
        }
    }
    TypeFic.prototype.read = function (input) {
        if (input === void 0) { input = ''; }
        var output = {
            text: '',
            choices: ['']
        };
        if (this.gameState.gameOver) {
            output.text = 'game over.';
            return output;
        }
        var oldChapter = this.gameState.currentBook.bookChapters[this.gameState.currentChapter];
        var oldChapterChoicePageIndex = oldChapter.chapterPages.length - 1;
        var oldChoices;
        var oldPage;
        var changingChapter = this.gameState.currentPageIndex == oldChapterChoicePageIndex;
        if (changingChapter) {
            oldPage = oldChapter.chapterPages[oldChapterChoicePageIndex];
            oldChoices = oldChapter.chapterEndingChoices;
        }
        else {
            oldPage = oldChapter.chapterPages[this.gameState.currentPageIndex];
            oldChoices = {
                'continue': function (currentState) {
                    currentState.currentPageIndex++;
                    return;
                }
            };
        }
        if (!input) {
            if (typeof oldPage == "string") {
                output.text = oldPage;
            }
            else if (typeof oldPage == "function") {
                output.text = oldPage(this.gameState);
            }
            output.choices = Object.keys(oldChoices);
            return output;
        }
        else if (input in oldChoices) {
            oldChoices[input](this.gameState);
            if (changingChapter)
                this.gameState.currentPageIndex = 0;
            return this.read();
        }
        else {
            output.text = 'invalid input: "' + String(input) + '"';
            output.choices = Object.keys(oldChoices);
            return output;
        }
    };
    return TypeFic;
}());
exports.TypeFic = TypeFic;
/*
End TypeFic interactive fiction framework.
*/
},{}],2:[function(require,module,exports){
/*
Bill's Passage TypeFic.
Developed by Benny Mattis.

To the extent possible under law, Benny Mattis has waived all copyright and related or neighboring rights to Bill’s Passage. This work is published from: United States.
*/
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sampleBook = {
    bookChapters: {
        'select_mode': {
            chapterPages: [
                'Welcome to Bill\'s Passage!',
                '<a href="https://www.loc.gov/collections/national-jukebox/about-this-collection/" target="_blank">Click here to play background music from the National Jukebox in a new tab.</a>',
                'Please select a mode of play.'
            ],
            chapterEndingChoices: {
                'normal mode (gain support to influence decisive votes)': function (currentState) {
                    currentState.currentChapter = 'tutorial_1';
                    return;
                },
                'cheat mode (win every decision regardless of votes)': function (currentState) {
                    currentState.currentVariables.godMode = true;
                    currentState.currentChapter = 'tutorial_1';
                    return;
                }
            }
        },
        'tutorial_1': {
            chapterPages: [
                function (currentState) {
                    currentState.currentVariables.cutscene = 'Bill';
                    return "Hi! I'm Bill.";
                },
                "BILL: After waiting for what seemed like an eternity, I've finally got a chance to become law, just like my predecessors.",
                "I'm willing to work hard, because I know I've got what it takes to get passed!",
                function (currentState) {
                    currentState.currentVariables.cutscene = 'ancestor';
                    return "PREDECESSOR: BILL! We are rooting for you from the halls of history!";
                },
                "But there are a few things you must understand before you make your way through the United States Government.",
                "First of all, you will need the support of the public as well as the support of elected representatives in order to get passed in the House, in the Senate, and at the President's desk.",
                "You can interact with only one representative at a time, but representatives who support you will sometimes help by advocating for you among their colleagues.",
                "Industry support gives you money, which will increase the impact of your next move to garner support from the public or from a representative.",
                "Keep in mind your supporters don\'t want to see you put all your eggs in one basket! Your impact will decrease if you garner the same type of support multiple weeks in a row.",
                "Pardon me, Bill, but can you help me remember what kind of bill you are?"
            ],
            chapterEndingChoices: {
                'Infrastructure': function (currentState) {
                    currentState.currentVariables.subcomm = "Infrastructure";currentState.currentChapter = 'tutorial_2';
                    return;
                },
                'Education': function (currentState) {
                    currentState.currentVariables.subcomm = "Education";
                    currentState.currentChapter = 'tutorial_2';
                    return;
                },
                'Foreign Affairs': function (currentState) {
                    currentState.currentVariables.subcomm = 'Foreign Affairs';currentState.currentChapter = 'tutorial_2';
                    return;
                },
                'Taxation': function (currentState) {
                    currentState.currentVariables.subcomm = "Taxation"; 
                    currentState.currentChapter = 'tutorial_2';
                    return;
                },
                'Armed Services': function (currentState) {
                    currentState.currentVariables.subcomm = "Armed Services";currentState.currentChapter = 'tutorial_2';
                    return;
                },
                'Social Services': function (currentState) {
                    currentState.currentVariables.subcomm = "Social Services";currentState.currentChapter = 'tutorial_2';
                    return;
                },
                'Science and Technology': function (currentState) {
                    currentState.currentVariables.subcomm = "Science and Technology";
                    currentState.currentChapter = 'tutorial_2';
                    return;
                }
            }
        },
        'tutorial_2': {
            chapterPages: [
                "And can you remind me where it was that you came from?",
                "Bills from grassroots organizations have an easier time garnering public support. Bills from corporate lobbyists have access to more industry support, and special interest groups can garner support from individual representatives more easily. "
            ],
            chapterEndingChoices: {
                'Grassroots Organization': function (currentState) {
                    currentState.currentVariables.origin = "Grassroots Organization";
                    currentState.currentChapter = 'tutorial_3';
                    return;
                },
                'Corporate Lobby': function (currentState) {
                    currentState.currentVariables.origin = "Corporate Lobby";
                    currentState.currentChapter = 'tutorial_3';
                    return;
                },
                'Special Interest Group': function (currentState) {
                    currentState.currentVariables.origin = "Special Interest Group";
                    currentState.currentChapter = 'tutorial_3';
                    return;
                }
            }
        },
        'tutorial_3': {
            chapterPages: [
                function (currentState) {
                    return `Ah yes, now I remember! Have you really come all the way from your humble beginnings as a mere idea in ${currentState.currentBook.bookFunctions.article(currentState.currentVariables.origin)} all the way to the ${currentState.currentVariables.subcomm} Committee in the House of Representatives? Time flies!`;
                },
                "Speaking of time, remember that if you take longer than two years (104 weeks) to gather the support you need, then you may be forgotten and lost to history.",
                "And if you go too long without garnering support from the public or from the representative currently considering you, then that support will decrease bit by bit.",
                "If you are satisfied with a representative's support for you, or if you think they are a lost cause, then you can move on to garner support from a different representative.",
                "When you are ready to be put to a vote, you can call the legislative body to make a decision for or against you.",
                "Now go, dear Bill, and make us proud by garnering support and getting passed in the House of Representatives!",
            ],
            chapterEndingChoices: {
                'Win Them Over!': function (currentState) {
                    currentState.currentBook.bookFunctions.generateMembers(currentState);
                    currentState.currentBook.bookFunctions.resetLocation(currentState);
                    currentState.currentVariables.pubSupp = (40 + Math.random() * 10);
                    currentState.currentVariables.cutscene = null;
                    currentState.currentVariables.lastAction.action = 'You are seeking support in the '+ currentState.currentVariables.places[currentState.currentVariables.level] +'.';
                    currentState.currentChapter = 'persuasion';
                    return;
                }
            }
        },
        'intro_1': {
            chapterPages: [
                "Next, you need to get through the Senate.",
                'There are only 100 Senators, and each one is very busy, so it takes more time to garner their support.',
                'If the decisive vote in the Senate is a tie, then the tie will be broken with a vote from the Vice President.',
                'Occasionally, a Senator will take up precious time with a long speech called a "<a href="https://www.senate.gov/about/powers-procedures/filibusters-cloture.htm" target="_blank">filibuster</a>."',
                'Just keep on working towards your goal, and don\'t lose heart as you garner the support of the Senate!'
            ],
            chapterEndingChoices: {
                'Win Them Over!': function (currentState) {
                    currentState.currentVariables.cutscene = null;
                    currentState.currentVariables.lastAction.action = 'You are seeking support in the '+ currentState.currentVariables.places[currentState.currentVariables.level] +'.';
                    currentState.currentChapter = 'persuasion';
                    return;
                }
            }
        },
        'intro_2': {
            chapterPages: [
                "The last stage before you can be passed as a law is on the President's desk.",
                'The President has only 10 days to sign you into law or <a href="https://constitution.congress.gov/browse/essay/artI-S7-C2-2/ALDE_00013645/" target="_blank">veto</a> you, which means you only have one chance to garner his support or the support of the public before he makes his decision.',
                'Remember, if he <a href="https://constitution.congress.gov/browse/essay/artI-S7-C2-2/ALDE_00013645/" target="_blank">vetoes</a> you, there is still hope!',
                'If you have garnered enough support among members of Congress, then the President\'s <a href="https://constitution.congress.gov/browse/essay/artI-S7-C2-2/ALDE_00013645/" target="_blank">veto</a> can be overturned.',
                'Lots of people have worked very hard for you to get this far, Bill.',
                'Best of luck in the White House!'
            ],
            chapterEndingChoices: {
                'Win Them Over!': function (currentState) {
                    currentState.currentVariables.cutscene = null;
                    currentState.currentVariables.lastAction.action = 'You are seeking support in the '+ currentState.currentVariables.places[currentState.currentVariables.level] +'.';
                    currentState.currentChapter = 'persuasion';
                    return;
                }
            }
        },
        'persuasion': {
            chapterPages: [
                function (currentState) {
                    var result = '';
                    if (currentState.currentVariables.level == 1 && Math.random() < 0.1) {
                        result += ('A Senator held up the Senate with a two-week <a href="https://www.senate.gov/about/powers-procedures/filibusters-cloture.htm" target="_blank">filibuster</a>! You lost precious time. Nevertheless, ');
                        currentState.currentBook.bookFunctions.passTime(currentState, 2);
                    }
                    result += (currentState.currentBook.bookFunctions.describeAction(currentState.currentVariables.lastAction.action, currentState));
                    if  (currentState.currentVariables.lastAction.enhanced) {
                        result += (' You used your industrial support to maximize impact.');
                        currentState.currentVariables.lastAction.enhanced = false;
                    }
                    if (currentState.currentVariables.behindscene != 0) {
                        result += ' ' + currentState.currentVariables.behindscene + ' ' + currentState.currentVariables.titles[currentState.currentVariables.level] + (currentState.currentVariables.behindscene != 1 ? 's' : '') + ' advocated for you among colleagues.';
                        currentState.currentVariables.behindscene = 0;
                    }
                    return result;
                },
                'How do you want to spend your week?'
            ],
            chapterEndingChoices: {
                'Garner support from this person': function (currentState) {
                    currentState.currentBook.bookFunctions.setLastAction(currentState, 'You sought support from this person.');
                    const powerUp = currentState.currentVariables.indSupp / 1000;
                    const baseInitial = (currentState.currentVariables.level == 0) ? 30 : 20;
                    const base = currentState.currentVariables.origin == 'Special Interest Group' ? (baseInitial * 1.5) : baseInitial;
                    const variance = (base / 2) - (Math.random() * base);
                    const base2 = (base + variance) * (0.75 ** currentState.currentVariables.lastAction.repeat);
                    currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]][currentState.currentVariables.conMember].support += base2 + (Math.random() + 1.5) * base * powerUp;
                    if (currentState.currentVariables.indSupp != 0) {
                        currentState.currentVariables.lastAction.enhanced = true;
                    }
                    currentState.currentVariables.indSupp = 0;
                    currentState.currentBook.bookFunctions.passTime(currentState, 1);
                    return;
                },
                'Garner public support': function (currentState) {
                    currentState.currentBook.bookFunctions.setLastAction(currentState, 'You sought support from the public.');
                    const powerUp = currentState.currentVariables.indSupp / 1000;
                    const baseInitial = .2;
                    const base = currentState.currentVariables.origin == 'Grassroots Organization' ? (baseInitial * 1.5) : baseInitial;
                    const variance = (base / 2) - (Math.random() * base);
                    const base2 = (base + variance) * (0.75 ** currentState.currentVariables.lastAction.repeat);
                    const calcResult = currentState.currentVariables.pubSupp + base2 + (Math.random() + 1.5) * base * powerUp;
                    currentState.currentVariables.pubSupp = calcResult >= 100 ? 99 : calcResult;
                    if (currentState.currentVariables.indSupp != 0) {
                        currentState.currentVariables.lastAction.enhanced = true;
                    }
                    currentState.currentVariables.indSupp = 0;
                    currentState.currentBook.bookFunctions.passTime(currentState, 1);
                    return;
                },
                'Garner industrial support': function (currentState) {
                    currentState.currentBook.bookFunctions.setLastAction(currentState, 'You sought support from industry.');
                    const baseInitial = 1000;
                    const base = currentState.currentVariables.origin == 'Corporate Lobby' ? baseInitial * 1.5 : baseInitial;
                    const variance = (base / 2) - (Math.random() * base);
                    currentState.currentVariables.indSupp += (base + variance) * (0.75 ** currentState.currentVariables.lastAction.repeat);
                    currentState.currentBook.bookFunctions.passTime(currentState, 1);
                    return;
                },
                'Find another member of Congress': function (currentState) {
                    currentState.currentBook.bookFunctions.setLastAction(currentState, 'You got the attention of another representative.');
                    currentState.currentVariables.seenMembers.push(currentState.currentVariables.conMember);
                    currentState.currentVariables.conMember = currentState.currentVariables.unseenMembers.pop();
                    currentState.currentBook.bookFunctions.passTime(currentState, 1);
                    return;
                },
                'Decision': function (currentState) {
                    currentState.currentChapter = 'choose_decision';
                    return;
                },
            }
        },
        'choose_decision': {
            chapterPages: [
                function (currentState) {
                    return 'Are you sure you wish to move to a decision in the '+ currentState.currentVariables.decisionSites[currentState.currentVariables.level] +'?';
                }
            ],
            chapterEndingChoices: {
                'Yes, move to a decision.': function (currentState) {
                    currentState.currentVariables.cutscene = 'ancestor';
                    var nays = 0;
                    var yays = 0;
                    for (var memberName in currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]]) {
                        if (currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]][memberName].support > 99) {
                            currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]][memberName].support = 99;
                        }
                        else {
                            currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]][memberName].support = (currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]][memberName].support * 2 + currentState.currentVariables.pubSupp) / 3;
                        }
                        if (Math.random() * 100 < currentState.currentVariables.allMembers[currentState.currentVariables.titles[currentState.currentVariables.level]][memberName].support) {
                            yays++;
                        }
                        else {
                            nays++;
                        }
                    }
                    if (nays == yays) 0.5 - Math.random() < 0 ? nays++ : yays++;
                    currentState.currentVariables.result = [nays, yays];
                    var success = currentState.currentVariables.godMode ? true : yays > nays;
                    if (success) {
                        currentState.currentChapter = currentState.currentVariables.level == 2 ? 'congratulation' : 'decision_win';
                    }
                    else if (currentState.currentVariables.weeksRemaining < (14 - currentState.currentVariables.level)) {
                        currentState.currentVariables.weeksRemaining = 0;
                        currentState.currentChapter = currentState.currentVariables.level == 2 ? 'veto' : 'final_lose';
                    }
                    else {
                        currentState.currentChapter = currentState.currentVariables.level == 2 ? 'veto' : 'decision_lose';
                    }
                },
                'No, allow me to build more support first.': function (currentState) {
                    currentState.currentBook.bookFunctions.setLastAction(currentState, 'You are seeking support in the'+ currentState.currentVariables.places[currentState.currentVariables.level] +'.');
                    currentState.currentVariables.cutscene = null;
                    currentState.currentChapter = 'persuasion';
                }
            }
        },
        'decision_win': {
            chapterPages: [
                'Your supporters debated on your behalf.',
                'You were put to a vote.',
                function (currentState) {
                    var result = currentState.currentVariables.result[1] + currentState.currentVariables.result[0] == 101 ? 'The Vice President broke a tie in the Senate! ' : '';
                    result += `Result: ${currentState.currentVariables.result[1]} voted in favor. ${currentState.currentVariables.result[0]} voted against you.`;
                    return result;
                },
                function(currentState) {
                    currentState.currentBook.bookFunctions.setLastAction(currentState,'You advanced to the next stage.');
                    return 'Well done! The decision was made in your favor!';
                }
            ],
            chapterEndingChoices: {
                'continue': function (currentState) {
                    if (currentState.currentVariables.level == 2) {
                        currentState.currentChapter = 'congratulation';
                    }
                    else {
                        currentState.currentVariables.level++;
                        if (currentState.currentVariables.level == 2) {
                            currentState.currentVariables.weeksRemaining = 2;
                        }
                        currentState.currentBook.bookFunctions.resetLocation(currentState);
                        currentState.currentChapter = 'intro_' + currentState.currentVariables.level.toString();
                    }
                }
            }
        },
        'decision_lose': {
            chapterPages: [
                function (currentState) {
                    var result = currentState.currentVariables.result[1] + currentState.currentVariables.result[0] == 101 ? 'The Vice President broke a tie in the Senate! ' : '';
                    result += `Result: ${currentState.currentVariables.result[1]} voted in favor. ${currentState.currentVariables.result[0]} voted against you.`;
                    return result;
                },
                'The decision was made against you, Bill.',
                'But don\'t lose heart! Many bills have needed to undergo revisions and amendments before being passed.',
                'It\'s all part of the democratic process!',
                function(currentState) {
                    currentState.currentBook.bookFunctions.passTime(currentState, 6);
                    currentState.currentBook.bookFunctions.resetLocation(currentState);
                    currentState.currentBook.bookFunctions.setLastAction(currentState, 'You underwent several weeks of revision, and you are being considered in the ' + currentState.currentVariables.places[currentState.currentVariables.level] + '.');
                    return 'Are you ready to undergo revisions and amendments?';
                }
            ],
            chapterEndingChoices: {
                'Undergo amendments and try to build more support': function (currentState) {
                    currentState.currentVariables.cutscene = null;
                    currentState.currentChapter = 'persuasion';
                    return;
                }
            }
        },
        'veto': {
            chapterPages: [
                'You were <a href="https://constitution.congress.gov/browse/essay/artI-S7-C2-2/ALDE_00013645/" target="_blank">vetoed</a> at the President\'s desk!',
                'To overturn the <a href="https://constitution.congress.gov/browse/essay/artI-S7-C2-2/ALDE_00013645/" target="_blank">veto</a>, you will need a 2/3 majority in both the House and the Senate.',
            ],
            chapterEndingChoices: {
                'Attempt to overturn the President\'s veto': function (currentState) {
                    currentState.currentVariables.veto = true;
                    var houseNays = 0;
                    var houseYays = 0;
                    var senateNays = 0;
                    var senateYays = 0;
                    for (var memberName in currentState.currentVariables.allMembers['Representative']) {
                        if (Math.random() * 100 < currentState.currentVariables.allMembers['Representative'][memberName].support) {
                            houseYays++;
                        }
                        else {
                            houseNays++;
                        }
                    }
                    for (var memberName in currentState.currentVariables.allMembers['Senator']) {
                        if (Math.random() * 100 < currentState.currentVariables.allMembers['Senator'][memberName].support) {
                            senateYays++;
                        }
                        else {
                            senateNays++;
                        }
                    }
                    currentState.currentVariables.result = [houseYays, senateYays];
                    var success = currentState.currentVariables.godMode ? true : ((houseYays > houseNays) && (senateYays > senateNays));
                    if (success) {
                        currentState.currentChapter = 'congratulation';
                    }
                    else {
                        currentState.currentVariables.weeksRemaining = 0;
                        currentState.currentChapter = 'final_lose';
                    }
                }
            }
        },
        'final_lose': {
            chapterPages: [
                function (currentState) {
                    var result = currentState.currentVariables.result[1] + currentState.currentVariables.result[0] == 101 ? 'The Vice President broke a tie in the Senate! ' : '';
                    result += `Result: ${currentState.currentVariables.result[1]} voted in favor. ${currentState.currentVariables.result[0]} voted against you.`;
                    if (currentState.currentVariables.veto) {
                        if (currentState.currentVariables.result[0] >= 290) {
                            result = 'You had 2/3 supermajority support in the House of Representatives.';
                        }
                        else {
                            result = 'You did not have 2/3 supermajority support in the House of Representatives this time.'
                        }
                    }
                    return result;
                },
                function (currentState) {
                    var result = 'You do not have enough time to make amendments and try again.';
                    if (currentState.currentVariables.veto) {
                        if (currentState.currentVariables.result[0] < 290) {
                            return 'You did not have enough support to overturn the President\'s veto.';
                        }
                        if (currentState.currentVariables.result[1] >= 67) {
                            result = 'You had 2/3 supermajority support in the Senate.';
                        }
                        else {
                            result = 'You did not have 2/3 supermajority support in the House of Representatives this time. You did not have enough support to overturn the President\'s veto.'
                        }
                    }
                    return result;
                },
                'Better luck next time, Bill! You made a noble effort. (refresh page to try again)'
        ],
            chapterEndingChoices: {}
        },
        'congratulation': {
            chapterPages: [
                function (currentState) {
                    var result = '';
                    if (currentState.currentVariables.veto) {
                        result += 'You had the support of a 2/3 supermajority in both the House of Representatives and the Senate. ';
                    }
                    else {
                        result += 'Congratulations, Bill! You were signed you into law.';
                    }
                    return result;
                },
                'Welcome to the dwelling place of your predecessors!',
                'Refresh this page to play again.'
            ],
            chapterEndingChoices: {}
        }  

    },
    bookVariables: {
        veto: false,
        cutscene: 'scroll-logo',
        behindscene: 0,
        godMode: false,
        result: [],
        subcomm: '',
        origin: '',
        conMember: '',
        indSupp: 0,
        seenMembers: [],
        unseenMembers: [],
        allMembers: {
            Representative: {},
            Senator: {},
            President: {}
        },
        pubSupp: 0,
        level: 0,
        decisionSites: ['House floor', 'Senate floor', 'President\'s Desk'],
        places: ['House of Representatives', 'Senate', 'White House'],
        titles: ['Representative', 'Senator', 'President'],
        lastAction: {
            enhanced: false,
            action: '',
            repeat: 0
        },
        weeksRemaining: 104,
        nameBank: [
            'Smith',
            'Johnson',
            'Williams',
            'Brown',
            'Jones',
            'Garcia',
            'Miller',
            'Davis',
            'Rodriguez',
            'Martinez',
            'Hernandez',
            'Lopez',
            'Gonzalez',
            'Wilson',
            'Anderson',
            'Thomas',
            'Taylor',
            'Moore',
            'Jackson',
            'Martin',
            'Lee',
            'Perez',
            'Thompson',
            'White',
            'Harris',
            'Sanchez',
            'Clark',
            'Ramirez',
            'Lewis',
            'Robinson',
            'Walker',
            'Young',
            'Allen',
            'King',
            'Wright',
            'Scott',
            'Torres',
            'Nguyen',
            'Hill',
            'Flores',
            'Green',
            'Adams',
            'Nelson',
            'Baker',
            'Hall',
            'Rivera',
            'Campbell',
            'Mitchell',
            'Carter',
            'Roberts',
            'Gomez',
            'Phillips',
            'Evans',
            'Turner',
            'Diaz',
            'Parker',
            'Cruz',
            'Edwards',
            'Collins',
            'Reyes',
            'Stewart',
            'Morris',
            'Morales',
            'Murphy',
            'Cook',
            'Rogers',
            'Gutierrez',
            'Ortiz',
            'Morgan',
            'Cooper',
            'Peterson',
            'Bailey',
            'Reed',
            'Kelly',
            'Howard',
            'Ramos',
            'Kim',
            'Cox',
            'Ward',
            'Richardson',
            'Watson',
            'Brooks',
            'Chavez',
            'Wood',
            'James',
            'Bennett',
            'Gray',
            'Mendoza',
            'Ruiz',
            'Hughes',
            'Price',
            'Alvarez',
            'Castillo',
            'Sanders',
            'Patel',
            'Myers',
            'Long',
            'Ross',
            'Foster',
            'Jimenez',
            'Powell',
            'Jenkins',
            'Perry',
            'Russell',
            'Sullivan',
            'Bell',
            'Coleman',
            'Butler',
            'Henderson',
            'Barnes',
            'Gonzalez',
            'Fisher',
            'Vasquez',
            'Simmons',
            'Romero',
            'Jordan',
            'Patterson',
            'Alexander',
            'Hamilton',
            'Graham',
            'Reynolds',
            'Griffin',
            'Wallace',
            'Moreno',
            'West',
            'Cole',
            'Hays',
            'Bryant',
            'Herrera',
            'Gibson',
            'Ellis',
            'Tran',
            'Medina',
            'Aguilar',
            'Stevens',
            'Murray',
            'Ford',
            'Castro',
            'Marshall',
            'Owens',
            'Harrison',
            'Fernandez',
            'McDonald',
            'Woods',
            'Washington',
            'Kennedy',
            'Wells',
            'Vargas',
            'Henry',
            'Chen',
            'Freeman',
            'Webb',
            'Tucker',
            'Guzman',
            'Burns',
            'Crawford',
            'Olson',
            'Simpson',
            'Porter',
            'Hunter',
            'Gordon',
            'Mendez',
            'Silva',
            'Shaw',
            'Snyder',
            'Mason',
            'Dixon',
            'Muñoz',
            'Hunt',
            'Hicks',
            'Holmes',
            'Palmer',
            'Wagner',
            'Black',
            'Robertson',
            'Boyd',
            'Rose',
            'Stone',
            'Salazar',
            'Fox',
            'Warren',
            'Mills',
            'Meyer',
            'Rice',
            'Schmidt',
            'Garza',
            'Daniels',
            'Ferguson',
            'Nichols',
            'Stephens',
            'Soto',
            'Weaver',
            'Ryan',
            'Gardner',
            'Payne',
            'Grant',
            'Dunn',
            'Kelley',
            'Spencer',
            'Hawkins',
            'Arnold',
            'Pierce',
            'Vazquez',
            'Hansen',
            'Peters',
            'Santos',
            'Hart',
            'Bradley',
            'Knight',
            'Elliott',
            'Cunningham',
            'Duncan',
            'Armstrong',
            'Hudson',
            'Carroll',
            'Lane',
            'Riley',
            'Andrews',
            'Alvarado',
            'Ray',
            'Delgado',
            'Berry',
            'Perkins',
            'Hoffman',
            'Johnston',
            'Matthews',
            'Peña',
            'Richards',
            'Contreras',
            'Willis',
            'Carpenter',
            'Lawrence',
            'Sandoval',
            'Guerrero',
            'George',
            'Chapman',
            'Rios',
            'Estrada',
            'Ortega',
            'Watkins',
            'Green',
            'Nunez',
            'Wheeler',
            'Valdez',
            'Harper',
            'Burke',
            'Larson',
            'Santiago',
            'Maldonado',
            'Morrison',
            'Franklin',
            'Carlson',
            'Austin',
            'Dominguez',
            'Carr',
            'Lawson',
            'Jacobs',
            'O\'Brien',
            'Lynch',
            'Singh',
            'Vega',
            'Bishop',
            'Montgomery',
            'Oliver',
            'Jensen',
            'Harvey',
            'Williamson',
            'Gilbert',
            'Dean',
            'Sims',
            'Espinoza',
            'Howell',
            'Li',
            'Wong',
            'Reid',
            'Hanson',
            'Le',
            'McCoy',
            'Garrett',
            'Burton',
            'Fuller',
            'Wang',
            'Weber',
            'Welch',
            'Rojas',
            'Lucas',
            'Marquéz',
            'Fields',
            'Park',
            'Yang',
            'Little',
            'Banks',
            'Padilla',
            'Day',
            'Walsh',
            'Bowman',
            'Schultz',
            'Luna',
            'Fowler',
            'Mejia',
            'Davidson',
            'Acosta',
            'Brewer',
            'May',
            'Holland',
            'Juárez',
            'Newman',
            'Pearson',
            'Curtis',
            'Cortéz',
            'Douglas',
            'Schneider',
            'Joseph',
            'Barrett',
            'Navarro',
            'Figueroa',
            'Keller',
            'Avila',
            'Wade',
            'Molina',
            'Stanley',
            'Hopkins',
            'Campos',
            'Barnett',
            'Bates',
            'Chambers',
            'Caldwell',
            'Beck',
            'Miranda',
            'Byrd',
            'Craig',
            'Ayala',
            'Lowe',
            'Frazier',
            'Powers',
            'Neal',
            'Leonard',
            'Gregory',
            'Carrillo',
            'Sutton',
            'Fleming',
            'Rhodes',
            'Shelton',
            'Schwartz',
            'Norris',
            'Jennings',
            'Watts',
            'Duran',
            'Walters',
            'Cohen',
            'McDaniel',
            'Moran',
            'Parks',
            'Stelle',
            'Vaughn',
            'Becker',
            'Holt',
            'DeLeon',
            'Barker',
            'Terry',
            'Hale',
            'Leon',
            'Hail',
            'Benson',
            'Haynes',
            'Horton',
            'Miles',
            'Lyons',
            'Pham',
            'Graves',
            'Bush',
            'Thornton',
            'Wolfe',
            'Warner',
            'Cabrera',
            'McKinney',
            'Mann',
            'Zimmerman',
            'Dawson',
            'Lara',
            'Fletcher',
            'Page',
            'McCarthy',
            'Love',
            'Robles',
            'Cervantes',
            'Solis',
            'Erickson',
            'Reeves',
            'Chang',
            'Klein',
            'Salinas',
            'Fuentes',
            'Baldwin',
            'Daniel',
            'Simon',
            'Velasquez',
            'Hardy',
            'Higgins',
            'Aguirre',
            'Lin',
            'Cummings',
            'Chandler',
            'Sharp',
            'Barber',
            'Bowen',
            'Ochoa',
            'Dennis',
            'Robbins',
            'Liu',
            'Ramsey',
            'Francis',
            'Griffith',
            'Paul',
            'Blair',
            'O\'Connor',
            'Cardenas',
            'Pacheco',
            'Cross',
            'Calderon',
            'Quinn',
            'Moss',
            'Swanson',
            'Chan',
            'Rivas',
            'Khan',
            'Rodgers',
            'Serrano',
            'Fitzgerald',
            'Rosales',
            'Stevenson',
            'Christensen',
            'Manning',
            'Gill',
            'Curry',
            'McLaughlin',
            'Harmon',
            'McGee',
            'Gross',
            'Doyle',
            'Garner',
            'Newton',
            'Burgess',
            'Reese',
            'Walton',
            'Blake',
            'Trujillo',
            'Adkins',
            'Brady',
            'Goodman',
            'Roman',
            'Webster',
            'Goodwin',
            'Fischer',
            'Huang',
            'Potter',
            'Delacruz',
            'Montoya',
            'Todd',
            'Wu',
            'Hines',
            'Mullins',
            'Castaneda',
            'Malone',
            'Cannon',
            'Tate',
            'Mack',
            'Sherman',
            'Hubbard',
            'Hodges',
            'Zhang',
            'Guerra',
            'Wolf',
            'Valencia',
            'Saunders',
            'Franco',
            'Rowe',
            'Gallagher',
            'Farmer',
            'Hammond',
            'Hampton',
            'Townsend',
            'Ingram',
            'Wise',
            'Gallegos',
            'Clarke',
            'Barton',
            'Schroeder',
            'Maxwell',
            'Waters',
            'Logan',
            'Camacho',
            'Strickland',
            'Norman',
            'Person',
            'Colon',
            'Parsons',
            'Frank',
            'Harrington',
            'Glover',
            'Osborne',
            'Buchanan',
            'Casey',
            'Floyd',
            'Patton',
            'Ibarra',
            'Ball',
            'Tyler',
            'Suarez',
            'Bowers',
            'Orozco',
            'Salas',
            'Cobb',
            'Gibbs',
            'Andrade',
            'Bauer',
            'Conner',
            'Moody',
            'Escobar',
            'McGuire',
            'Lloyd',
            'Mueller',
            'Hartman',
            'French',
            'Kramer',
            'McBride',
            'Pope',
            'Lindsey',
            'Velazqez',
            'Norton',
            'McCormick',
            'Sparks',
            'Flynn',
            'Yates',
            'Hogan',
            'Marsh'
        ]
    },
    bookFunctions: {
        article: function (str) {
            const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
            if ((str.length > 0) && vowels.includes(str[0])) {
                return 'an ' + str;
            }
            else {
                return 'a ' + str;
            }
        },
        generateMembers: function (state) {
            var nameBank = state.currentVariables.nameBank;
            nameBank.sort((a, b) => 0.5 - Math.random());
            nameBank.forEach((bankName, index) => {
                var title;
                if (index < 435) {
                    title = 'Representative';
                }
                else if (index < 535) {
                    title = 'Senator';
                }
                else if (index == 535) {
                    title = 'President'
                }
                else {
                    title = 'Citizen';
                }
                state.currentVariables.allMembers[title][bankName] = {
                    support: (10 + Math.random() * 60),
                    color: 'rgb(' + 
                        Math.floor(100 + Math.random() * 156).toString() + ' ' + 
                        Math.floor(Math.random() * 156).toString() + ' ' + 
                        Math.floor(Math.random() * 156).toString() +
                        ')',
                    shape: 'url(./assets/shape' + Math.floor(Math.random() * 5).toString() + '.png)'
                };
            });
        },
        resetLocation: function (state) {
            var location = state.currentVariables.titles[state.currentVariables.level];
            state.currentVariables.seenMembers = [];
            state.currentVariables.unseenMembers = Object.keys(state.currentVariables.allMembers[location]);
            state.currentVariables.unseenMembers.sort((a, b) => 0.5 - Math.random());
            state.currentVariables.conMember = state.currentVariables.unseenMembers.pop();
        },
        passTime: function (state, time) {
            state.currentVariables.weeksRemaining -= time;
            if (state.currentVariables.lastAction.action != 'You sought support from the public.') {state.currentVariables.pubSupp -= 0.1 * time;}
            var member = state.currentVariables.conMember;
            if (state.currentVariables.lastAction.action != 'You sought support from this person.') {state.currentVariables.allMembers[state.currentVariables.titles[state.currentVariables.level]][member].support -= 2.5 * time;}
            for (var i = 0; i < state.currentVariables.seenMembers.length; i++) {
                var memberName = state.currentVariables.seenMembers[i];
                var member = state.currentVariables.allMembers[state.currentVariables.titles[state.currentVariables.level]][memberName];
                if (member.support / 100 > Math.random()) {
                    var convertName = state.currentVariables.unseenMembers[Math.floor(Math.random() * state.currentVariables.unseenMembers.length)];
                    var convertMember = state.currentVariables.allMembers[state.currentVariables.titles[state.currentVariables.level]][convertName];
                    convertMember.support += 15;
                    if (convertMember.support > 99) {convertMember.support = 99;}
                    state.currentVariables.behindscene += 1;
                }
            }
            if (state.currentVariables.weeksRemaining < 0) {state.currentVariables.weeksRemaining = 0;}
            if (state.currentVariables.pubSupp < 0) {state.currentVariables.pubSupp = 0;}
            if (state.currentVariables.allMembers[state.currentVariables.titles[state.currentVariables.level]][state.currentVariables.conMember].support < 0) {state.currentVariables.allMembers[state.currentVariables.titles[state.currentVariables.level]][state.currentVariables.conMember].support = 0;}
        },
        setLastAction: function (currentState, newAction) {
            var actionObj = currentState.currentVariables.lastAction;
            if (actionObj.action == newAction) {
                actionObj.repeat++;
            }
            else {
                actionObj.action = newAction;
                actionObj.repeat = 0;
            }
        },
        describeAction: function (actionStr, currentState) {
            var interlocutorTitle = currentState.currentVariables.titles[currentState.currentVariables.level];
            var interlocutor = interlocutorTitle + ' ' + currentState.currentVariables.conMember;
            switch (actionStr) {
                case 'You got the attention of another representative.':
                    return 'You got the attention of another ' + interlocutorTitle + ': ' + interlocutor + '.';
                case 'You sought support from this person.':
                    var possibilities = [
                        'One of ' + interlocutor + '\'s top donors suggested that it would be a good idea to vote for you. ' + interlocutor + ' became more interested in supporting you.',
                        interlocutor + '\'s eldest child mentioned learning about you in a college class about current affairs. ' + interlocutor + ' became more interested in supporting you.',
                        'You rose to the top of a pile of papers on ' + interlocutor + '\'s desk. '  + interlocutor + ' became more interested in supporting you.',
                        interlocutor + '\'s constituents wrote some letters on your behalf. ' + interlocutor + ' became more interested in supporting you.',
                        interlocutor + '\'s Communications Director determined that voting for you would make ' + interlocutor + ' look good for the next election. ' + interlocutor + ' became more interested in supporting you.',
                        'The leader of ' + interlocutor + '\'s political party pushes ' + interlocutor + ' to support you. ' + interlocutor + ' became more interested in supporting you.',
                        'You remind ' + interlocutor + ' of the values that inspired ' + interlocutor + ' to pursue a career in politics. ' + interlocutor + ' became more interested in supporting you.',
                        interlocutor + ' sees an opportunity to gain supporters by advocating in your favor. ' + interlocutor + 'became more interested in supporting you.',
                        interlocutor + '\'s relative is personally affected by an issue that would be resolved by passing you into law. ' + interlocutor + ' became more interested in supporting you.',
                        interlocutor + ' is convinced to support you after discussing you with members of the ' + currentState.currentVariables.subcomm + ' Committee. ' + interlocutor + ' became more interested in supporting you.'

                    ];
                    return possibilities[Math.floor(Math.random() * possibilities.length)];
                case 'You sought support from the public.':
                    var possibilities = [
                        'You went viral on social media. ' + 'You gained some public support.',
                        'A religious leader publicly endorsed you. ' + 'You gained some public support.',
                        'A documentary filmmaker made a movie about why you should be passed into law. ' + 'You gained some public support.',
                        'A famous actor mentioned you in their awards speech. ' + 'You gained some public support.',
                        'A famous singer wrote a hit song about you. ' + 'You gained some public support.',
                        'An indie game developer made a hip virtual-reality game that illustrated the potential benefits of passing you into law. '  + 'You gained some public support.',
                        'A big-budget game developer illustrated your potential benefits in the latest installment of their most famour franchise. '+ 'You gained some public support.',
                        'An activist group drew attention to your cause. ' + 'You gained some public support.',
                        'You were discussed on a popular podcast. ' + 'You gained some public support.',
                        'You were discussed on a popular late-night talk show. ' + 'You gained some public support.'
                    ];
                    return possibilities[Math.floor(Math.random() * possibilities.length)];
                case 'You sought support from industry.':
                    var possibilities = [
                        'You were endorsed by a big union. ' + 'Your industrial support increased.',
                        'An economist predicted that passing you into law would stimulate the economy. ' + 'Your industrial support increased.',
                        'A trade partner of the United States indicated that passing you into law would strengthen ties. ' + 'Your industrial support increased.',
                        'A group of big-business CEOs determined that it would be in their interests for you to be passed into law. ' + 'Your industrial support increased.',
                        'Small business owners determined that it would be in their interests for you to be signed into law. ' + 'Your industrial support increased.',
                        'Venture capitalists speculate that passing you into law would spur increased creativity and entrepreneurship. ' + 'Your industrial support increased.',
                        'Some wealthy anonymus donors contributed to a political action committee (PAC) that supports you. ' + 'Your industrial support increased.',
                        'Some titans of finance discover how passing you into law would benefit the companies that they own. ' + 'Your industrial support increased.'
                    ];
                    return possibilities[Math.floor(Math.random() * possibilities.length)];
                default:
                    return actionStr;
            }
        }
    }
};
exports.default = sampleBook;
/*
End Bill's Passage TypeFic.
*/
},{}],3:[function(require,module,exports){
/*
Bill's Passage user interface.
Developed by Benny Mattis.

To the extent possible under law, Benny Mattis has waived all copyright and related or neighboring rights to Bill’s Passage. This work is published from: United States.
*/
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TypeFic_1 = require("./TypeFic");
var sampleBook_1 = require("./sampleBook");
var startingState = {
    currentBook: sampleBook_1.default,
    currentChapter: 'select_mode',
    currentPageIndex: 0,
};
var tf = new TypeFic_1.TypeFic(startingState);
var textP = document.getElementById('text');
var suppDiv = document.getElementById('support');
var buttonDiv = document.getElementById('buttons');
var indSuppDiv = document.getElementById('indSupp');
var pubSuppDiv = document.getElementById('pubSupp');
var conSuppDiv = document.getElementById('conSupp');
var daysDiv = document.getElementById('days');
var interlocutorDiv = document.getElementById('interlocutor');
var statusDiv = document.getElementById('status');
var tfOut = tf.read();
var text = String(tfOut.text);
var refresh = function () {
    buttonDiv.innerHTML = '';
    textP.innerHTML = text;
    indSuppDiv.innerText = 'Industry support: $' + Math.ceil(tf.gameState.currentVariables.indSupp);
    if (tf.gameState.currentVariables.cutscene == null) {
        var currentRepTitle = tf.gameState.currentVariables.titles[tf.gameState.currentVariables.level];
        var currentRepName = tf.gameState.currentVariables.conMember;
        var currentRepObject = tf.gameState.currentVariables.allMembers[currentRepTitle][currentRepName];
        var supportLevel = Math.floor(currentRepObject['support']); 
        var interestLevel;
        if (supportLevel < 10) {interestLevel ='deeply opposed to supporting you';}
        else if (supportLevel < 20) {interestLevel ='opposed to supporting you';}
        else if (supportLevel < 30) {interestLevel ='not at all interested in supporting you';}
        else if (supportLevel < 40) {interestLevel ='not interested in supporting you';}
        else if (supportLevel < 50) {interestLevel ='almost interested in supporting you';}
        else if (supportLevel < 60) {interestLevel ='somewhat interested in supporting you';}
        else if (supportLevel < 70) {interestLevel ='interested in supporting you';}
        else if (supportLevel < 80) {interestLevel ='very interested in supporting you';}
        else if (supportLevel < 90) {interestLevel ='committed to supporting you';}
        else {interestLevel ='deeply committed to supporting you';}
        suppDiv.style.visibility = 'visible';
        conSuppDiv.innerText = currentRepTitle + ' ' + currentRepName + ': ' + interestLevel;
        conSuppDiv.style.visibility = 'visible';
        statusDiv.style.backgroundImage = 'url(./assets/' + currentRepTitle + '.jpg)';
        interlocutorDiv.style.backgroundImage = currentRepObject['shape'];
        interlocutorDiv.style.backgroundColor = currentRepObject['color'];
    }
    else {
        suppDiv.style.visibility = 'hidden';
        conSupp.style.visibility = 'hidden';
        if (tf.gameState.currentVariables.cutscene == 'ancestor') {
            statusDiv.style.backgroundImage = 'url(./assets/capitol.jpg)';
        }
        else {
            statusDiv.style.backgroundImage = 'url(./assets/stars.png)';
        }
        interlocutorDiv.style.backgroundImage = 'url(./assets/'+tf.gameState.currentVariables.cutscene+'.png)';
        interlocutorDiv.style.backgroundColor = 'transparent';
    }
    pubSuppDiv.innerText = 'Public support: ' + tf.gameState.currentVariables.pubSupp.toFixed(1) + '%';
    daysDiv.innerText = tf.gameState.currentVariables.weeksRemaining + ' weeks remaining';
    if (tf.gameState.gameOver) {
        return;
    }
    tfOut.choices.forEach(function (choice) {
        if ( 
            !(
                (choice == 'Find another member of Congress' && !tf.gameState.currentVariables.unseenMembers.length)
                ||
                ( 
                    (
                        tf.gameState.currentVariables.weeksRemaining <= (3 - tf.gameState.currentVariables.level) 
                    ) 
                    &&
                    (
                        (
                            tf.gameState.currentChapter == 'persuasion' && choice != 'Decision' && tf.gameState.currentPageIndex == (tf.gameState.currentBook.bookChapters[tf.gameState.currentChapter].chapterPages.length - 1)
                        ) 
                        || 
                        (
                            tf.gameState.currentChapter == 'choose_decision' && choice != 'Yes, move to a decision.' && tf.gameState.currentPageIndex == (tf.gameState.currentBook.bookChapters[tf.gameState.currentChapter].chapterPages.length - 1)
                        ) 
                    )
                ) 
                || 
                (tf.gameState.currentVariables.level == 2 && choice == 'Garner industrial support') 
            )
            ) {
            var currentButton = document.createElement('button');
            if (choice == 'Garner support from this person') {
                currentButton.innerText = 'Garner support from this ' + currentRepTitle;
            }
            else if (choice == 'Find another member of Congress') {
                currentButton.innerText = 'Find another ' + currentRepTitle;
            }
            else if (choice == 'Decision') {
                currentButton.innerText = 'Decision: ' + tf.gameState.currentVariables.places[tf.gameState.currentVariables.level];
            }
            else {
                currentButton.innerText = choice;
            }
            currentButton.onclick = function () {
                tfOut = tf.read(choice);
                text = String(tfOut.text);
                refresh();
            };
            buttonDiv.appendChild(currentButton);
        }
        return;
    });
};
refresh();
/*
End Bill's Passage user interface.
*/
},{"./TypeFic":1,"./sampleBook":2}]},{},[3]);
