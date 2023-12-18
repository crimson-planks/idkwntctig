function unitTest_FormatValue(){
    let testResultArray = [
        {
            test: new Decimal(1),
            result: "1.00"
        }
    ];
    testResultArray.forEach(element => {
        if(!(FormatValue(element.test)===element.result)) throw Error(`Error in unit test: ${element.test.toString()}. Expected Value: ${element.result.toString()}`)
        return true;
    });
}