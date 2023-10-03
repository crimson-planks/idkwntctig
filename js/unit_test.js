function unit_test(func, testResultArray){
    testResultArray.forEach(element => {
        if(!(func(element.test)===element.result)) throw Error(`Error in unit test: ${element.test.toString()}. Expected Value: ${element.result.toString()}`)
        return true;
    });
}