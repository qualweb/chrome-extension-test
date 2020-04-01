export default class DecisionTree {
    static fail = 0;
    static pass = 0;
    static innaplicable = 0;

    static addToFail() {
        console.log("add fail");
        DecisionTree.fail++;
    }

    static removeFail() {
        DecisionTree.fail--;
    }

    static addToPass() {
        console.log("add pass");
        DecisionTree.pass++;
    }

    static addToInnaplicable() {
        console.log("add inapplicable");
        DecisionTree.innaplicable++;
    }

    static removeInnaplicable() {
        DecisionTree.innaplicable--;
    }

    static removePass() {
        DecisionTree.pass--;
    }

    constructor(data) {
        this.data = data.fluxo;
        this._current = this.data[0];
        this.allValues = [this.data[0]];
    }

    next(result) {
        let resultValue;

        if (this._current.status) {
            return this._current;
        }

        if (result === true) {
            resultValue = "answerYes";
        } else {
            resultValue = "answerNo";
        }

        const resultIndex = this.data.findIndex(value => {
            return value.key === this._current[resultValue];
        });

        this.allValues.push(this.data[resultIndex]);
        this._current = this.data[resultIndex];

        if (!this._current.answerYes && !this._current.answerNo) {
            const checkPass = this._current.key.includes("Pass");
            const checkFail = this._current.key.includes("Fail");
            if (checkPass) {
                DecisionTree.addToPass();
                this._current.status = "Pass";
            }
            if (checkFail) {
                DecisionTree.addToFail();
                this._current.status = "Fail";
            }
        }

        return this._current;
    }

    current() {
        return this._current;
    }

    revert() {
        if (this._current.status && this._current.status === "Pass") {
            DecisionTree.removePass();
        } else if (this._current.status && this._current.status === "Fail") {
            DecisionTree.removeFail();
        }

        this.allValues = [this.allValues[0]];
        this._current = this.allValues[0];
        return this._current;
    }

    prev() {
        if(this.allValues.length === 1) {
            return this._current;
        } 
        const removedValue = this.allValues.pop();

        if(removedValue === "Pass") {
            DecisionTree.removePass();
        }

        if(removedValue === "Fail") {
            DecisionTree.removeFail();
        }

        this._current = this.allValues[this.allValues.length - 1];

        return this._current;
    }
}