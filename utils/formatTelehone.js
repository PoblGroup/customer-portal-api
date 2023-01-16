const FormatTelephoneNumber = (telephoneNumber) => {
    // Remove spaces from the telephone number
    while (telephoneNumber.indexOf(" ") != -1) 
    {
        telephoneNumber = telephoneNumber.slice(0, telephoneNumber.indexOf(" ")) + telephoneNumber.slice(telephoneNumber.indexOf(" ") + 1)
        console.log("Removing spaces: " + telephoneNumber);
    }    

    // Remove hyphens from the telephone number
    while (telephoneNumber.indexOf("-") != -1) 
    {
        telephoneNumber = telephoneNumber.slice(0, telephoneNumber.indexOf("-")) + telephoneNumber.slice(telephoneNumber.indexOf("-") + 1)
        console.log("Removing hyphens: " + telephoneNumber);
    }    

    // Remove open brackets from the telephone number
    while (telephoneNumber.indexOf(")") != -1) 
    {
        telephoneNumber = telephoneNumber.slice(0, telephoneNumber.indexOf(")")) + telephoneNumber.slice(telephoneNumber.indexOf(")") + 1)
        console.log("Removing open brackets: " + telephoneNumber);
    }    

    // Remove closing brackets from the telephone number
    while (telephoneNumber.indexOf("(") != -1) 
    {
        telephoneNumber = telephoneNumber.slice(0, telephoneNumber.indexOf("(")) + telephoneNumber.slice(telephoneNumber.indexOf("(") + 1)
        console.log("Removing closing brackets: " + telephoneNumber);
    }    

    // Replace a starting 0 with +44
    if (telephoneNumber.indexOf("0") == 0) 
    {
        telephoneNumber = telephoneNumber.replace("0", "+44");
    }

    // Replace a starting 44 with +44
    if (telephoneNumber.indexOf("44") == 0) 
    {
        telephoneNumber = telephoneNumber.replace("44", "+44");
    }

    // Replace a starting +440 with +44
    if (telephoneNumber.indexOf("+440") == 0) 
    {
        telephoneNumber = telephoneNumber.replace("+440", "+44");
    }

    return telephoneNumber
}


module.exports = {
    FormatTelephoneNumber
}