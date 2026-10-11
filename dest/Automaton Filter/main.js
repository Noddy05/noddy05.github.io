"use strict";
let iterationIndex = 0;
//let rules: [number[], number[]] = [[0, 1, 7, 8], [3, 5]];
let rules = [[0, 1, 2], [1, 2, 3, 4, 5, 8]]; // Algorithmy
// Game of life'y: let the survival rule be [1, 2, ..., 6, 8] (anything but 7)
const interestingRules = {
    "Automaton Pattern": [
        "B012/S123458",
        "B02358/S1234568",
        "B0/S123458",
        "B01/S123458",
        "B0123/S123458",
        "B01234/S123458",
        "B0126/S123458",
        "B01267/S123458",
        "B012678/S123458",
        "B0123/S123578",
        "B17/S124568",
        "B178/S124568",
        "B1678/S124568",
        "B1678/S12458",
        "B1678/S12458",
        "B1678/S124578",
        "B1678/S12478",
        "B1678/S124678",
        "B1678/S12578",
        "B01/S01235678",
    ],
    "Intersting": [
        "B01678/S125678",
        "B01678/S12578",
        "B12345678/S012345678",
        "B3/S23",
        "B0178/S35",
        "B1357/S02468",
        "B02468/S1357",
        "B3/S23",
        "B01234567/S8",
    ],
    "Subtle Pattern": [
        "B17/S012345678",
        "B1/S012345678",
        "B12/S012345678",
        "B178/S1245678",
        "B0123/S12357",
        //        "B0124/S12357",
        "B0126/S12357",
    ],
    "Blocky/Voronoi": [
        "B0/B014578",
        "B0/B01235678",
        "B12345678/B012345678",
        "B0/S012378",
        "B0/S01238",
        "B0/S0123678",
    ],
    "Spots": [
        "B17/S145678",
        "B05678/S0123456",
        "B05678/S01234568",
        "B0568/S01234568",
        "B0568/S01234568",
    ],
    "Lines": [
        "B0/S014",
        "B0/S34",
        "B0/S0134",
        "B0/S01234",
        "B0578/S",
        "B05678/S",
        "B0578/S04",
        "B0578/S03",
    ],
    "Cloudy/Dithering": [
        "B1234568/S01234567",
        "B12345678/S01234567",
        "B01678/S1246",
        "B01678/S12467",
        "B01678/S124567",
        "B01678/S12367",
        "B01678/S123567",
        "B01678/S012367",
        "B01678/S0123567",
        "B058/S147",
        "B0/S01457",
        "B0/S0145",
        "B0/S0123",
        "B12345678/S01234567",
    ]
};
const filterCanvas = document.createElement('canvas');
const filterCtx = filterCanvas.getContext('2d');
const displayDiv = document.getElementById('first_display');
filterCtx.getContextAttributes().willReadFrequently = true;
let filter = null;
let bornRuleDiv = null;
let surviveRuleDiv = null;
function generateDisplay() {
    const playButton = document.createElement('button');
    playButton.onclick = () => newFilter();
    playButton.innerText = 'Apply Filter';
    const pauseButton = document.createElement('button');
    pauseButton.onclick = () => { filter.isPlaying = !filter.isPlaying; };
    pauseButton.innerText = 'Pause';
    bornRuleDiv = document.createElement('div');
    bornRuleDiv.setAttribute('id', 'born_rule_div');
    for (let i = 0; i <= 8; i++) {
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        if (rules[0].includes(i))
            input.setAttribute('checked', 'true');
        bornRuleDiv.appendChild(input);
    }
    surviveRuleDiv = document.createElement('div');
    surviveRuleDiv.setAttribute('id', 'survive_rule_div');
    for (let i = 0; i <= 8; i++) {
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        if (rules[1].includes(i))
            input.setAttribute('checked', 'true');
        surviveRuleDiv.appendChild(input);
    }
    const premadeRulesContainer = document.createElement('select');
    premadeRulesContainer.setAttribute('id', 'premade_rules_div');
    Object.entries(interestingRules).forEach(([category, rules]) => {
        const listCategory = document.createElement('optgroup');
        listCategory.setAttribute('label', category);
        premadeRulesContainer.appendChild(listCategory);
        for (let i = 0; i < rules.length; i++) {
            const listElement = document.createElement('option');
            listElement.innerText = rules[i];
            listCategory.appendChild(listElement);
        }
    });
    premadeRulesContainer.onchange = () => {
        const newRules = convertToRules(premadeRulesContainer.value);
        for (let i = 0; i <= 8; i++) {
            bornRuleDiv.children[i].checked = false;
            surviveRuleDiv.children[i].checked = false;
        }
        for (let i = 0; i < newRules[0].length; i++) {
            bornRuleDiv.children[newRules[0][i]].checked = true;
        }
        for (let i = 0; i < newRules[1].length; i++) {
            surviveRuleDiv.children[newRules[1][i]].checked = true;
        }
        newFilter();
    };
    displayDiv.appendChild(playButton);
    displayDiv.appendChild(pauseButton);
    displayDiv.appendChild(bornRuleDiv);
    displayDiv.appendChild(surviveRuleDiv);
    displayDiv.appendChild(premadeRulesContainer);
}
function convertToRules(ruleString) {
    const stringSplit = ruleString.split('/');
    const birthString = stringSplit[0].slice(1);
    const survivalString = stringSplit[1].slice(1);
    return [stringToArray(birthString), stringToArray(survivalString)];
}
function stringToArray(str) {
    const array = [];
    for (let i = 0; i < str.length; i++) {
        array.push(+str[i]);
    }
    return array;
}
function newFilter() {
    let path = 'forbandet_ungdom_downscaled.png';
    //path = 'tiger-downscaled.png';
    filter = new Filter(path, bornRuleDiv, surviveRuleDiv);
    filter.startProcessing();
}
displayDiv.appendChild(filterCanvas);
generateDisplay();
newFilter();
