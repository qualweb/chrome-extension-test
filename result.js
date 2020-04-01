import rules from "./rules/index.js";
import DecisionTree from "./DecisionTree.js";

chrome.runtime.sendMessage({message:"resultLoaded"});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("receiving message");
        if(request.message === "resultsToPopup") {
            const listWrapper = document.querySelector(".list-wrapper");
            // lista de resultados ao utilizador
            
            const userEvaluationResult = [];
/*
            const button = document.createElement("button");
            button.textContent = "Next";

            button.setAttribute("disabled", "disabled");

            document.body.appendChild(button);
            button.onclick = function () {
                console.log("userEvaluationResult")
                console.log(userEvaluationResult);
                console.log(userEvaluationResult.length);
                /*
                const result = document.querySelector("#resultcount");
                const passCount = userEvaluationResult.filter(function(value) {
                    return value === "1";
                }).length;
                const failCount = userEvaluationResult.length - passCount;
                result.textContent = `Pass: ${passCount} Fail: ${failCount}`
                //
            }
*/
            const resultContent = document.querySelector("#resultcount");

            function refreshResult() {
                resultContent.textContent = `Pass: ${DecisionTree.pass} Fail: ${DecisionTree.fail}  Innaplicable: ${DecisionTree.innaplicable}`;
            }

            refreshResult();

            for (let i = 0; i < request.values.length; i++) {
                const ruleValue = request.values[i];
                const ruleCode = ruleValue.code;

                console.log("ruleValue", ruleValue);
                const ruleTitle = document.createElement("h2");
                const list = document.createElement("ul");
                list.id = ruleCode;

                ruleTitle.textContent = ruleCode;

                listWrapper.appendChild(ruleTitle);
                listWrapper.appendChild(list);

                const resultElement = document.createElement("li");

                const indexValue = rules.findIndex(rule => {
                    if(Array.isArray(rule)) {
                        return rule[0].code === ruleCode;
                    }
                    return rule.code === ruleCode;
                });

                const manualRule = rules[indexValue];

                if(indexValue === -1) {
                    resultElement.textContent = "No guide created for this rule";
                    list.appendChild(resultElement);
                    continue;
                }

                if (ruleValue.results.length === 0) {
                    resultElement.textContent = "No elements found for this rule";
                    list.appendChild(resultElement);
                }

                ruleValue.results.forEach((result, index) => {
                    if (Array.isArray(manualRule)) {
                        const done = manualRule.some(rule => {
                            if(isRuleValid(rule, result)) {
                                checkFluxogram(rule, result);
                                return true;
                            }
                        });
                        if (!done) {
                            checkFluxogram(manualRule[0], result);
                        }
                    } else {
                        checkFluxogram(manualRule, result);
                    }

                    function checkFluxogram(ruleToCheck, result) {
                        const resultWrapper = document.createElement("div");
                        const resultElement = document.createElement("li");

                        list.appendChild(resultWrapper);
                        resultWrapper.appendChild(resultElement);

                        if (isRuleValid(ruleToCheck, result)) {
                            function generateSystem() {
                                const decisionTree = new DecisionTree(ruleToCheck);
                                
                                resultElement.innerHTML = 
                                    `<div>
                                        this is the element:  "${result.htmlCode.replace(/</g,"&lt;")}"
                                        <div id="text-${index}">${decisionTree.current().title}</div>
                                        <div id="radios-${index}">
                                            <input type="radio" name="radio-${index}" value="1">yes
                                            <input type="radio" name="radio-${index}" value="0">no
                                        </div>
                                    </div>
                                `;

                                const radios = document.querySelectorAll("input[type='radio'][name='radio-"+ index +"']");
                                const text = document.querySelector("#text-"+ index);
                                //const radioWrapper = document.querySelector("#radios-"+ i);
                                text.innerHTML = decisionTree.current().title;
                        
                                console.log(radios);
                        
                                for (let f = 0; f < radios.length; f++) {
                                    radios[f].onchange = function (e) {
                                        userEvaluationResult[i] = e.target.value;
                        
                                        if (e.target.value === "1") {
                                            decisionTree.next(true);
                                        } else {
                                            decisionTree.next(false);
                                        }

                                        console.log(decisionTree.current());
                        
                                        if (decisionTree.current().status) {
                                            console.log("cheguei ao fim da fila");
                                            console.log(resultElement.innerHTML);
                                            console.log(index);
                                            refreshResult();
                                            resultElement.innerHTML = 
                                                `<div>
                                                    this is the element: "${result.htmlCode.replace(/</g,"&lt;")}"
                                                    <div>Status: ${decisionTree.current().status}</div>
                                                    <div>Reason: ${decisionTree.current().title}</div>
                                                </div>
                                            `;
                                            return;
                                        }
                        
                                        text.innerHTML = decisionTree.current().title;
                                        e.target.checked = false;

                                        console.log("decisionTree.allValues", decisionTree.allValues);

                                        if (decisionTree.allValues.length > 1) {
                                            if (!document.getElementById(`button-revert-${index}`)) {
                                                const button = document.createElement("button");
                                                button.id = `button-revert-${index}`;
                                                button.textContent = "Revert";
                                                resultWrapper.appendChild(button);

                                                button.onclick = function () {
                                                    resultWrapper.removeChild(button);
                                                    decisionTree.revert();
                                                    refreshResult();
                                                    generateSystem();
                                                }
                                            }
                                        }
                        
                        /*
                                        const filteredArray = userEvaluationResult.filter(function(value) {
                                            return value;
                                        });
                                        
                                        if(filteredArray.length === request.values.length) {
                                            button.removeAttribute("disabled");
                                        }
                        */
                                    }  
                                }
                                
                            // rad[i].addEventListener('change', function() {
                                            
                                
                                resultElement.addEventListener("mouseover", mouseOver);
                                resultElement.addEventListener("mouseout", mouseOut);
                        
                                function mouseOver() {
                                    chrome.runtime.sendMessage({message:"overResultElement", element:result.pointer}); //TODO TESTE SEM ASPAS//teste "html > body > div > header vs requestValues.pointer"
                                    
                                }
                                
                                function mouseOut() {
                                    chrome.runtime.sendMessage({message:"outResultElement", element:result.pointer});
                                }
                            }
                            generateSystem();
                        } else {
                            resultElement.innerHTML = 
                                `<div>
                                    this is the element: "${result.htmlCode.replace(/</g,"&lt;")}"
                                    <div>Status: ${result.verdict}</div>
                                    <div>Reason: ${result.description}</div>
                                </div>
                            `;
                            list.appendChild(resultElement);

                            if(result.verdict === "passed") {
                                DecisionTree.addToPass();
                            }
                            if(result.verdict === "failed") {
                                DecisionTree.addToFail();
                            }
                            if(result.verdict === "inapplicable") {
                                DecisionTree.addToInnaplicable();
                            }

                            refreshResult();
                        }
                    }

                });// enf foreach
            }// end for loop  
        }
    }
);

function isRuleValid(ruleToCheck, result) {
    const prerequesiteArray = ruleToCheck.prerequisite.replace(/\s/g, '').split(',');
    return prerequesiteArray.some(prerequesite => {
        return result.resultCode === prerequesite;
    })
}