//fields

//retreival of all needed elements
const form = document.querySelector("form");

const select_design = document.querySelector("#design");
const select_color = document.querySelector("#color");
const select_jobRole = document.querySelector("#title");
const select_payment = document.querySelector("#payment");

const field_name = document.querySelector("#name");
const field_mail = document.querySelector("#mail");
//an alternative text field for when the user selects "other" as a job role
const field_jobRole = document.querySelector("#other-title");
    field_jobRole.style.display = "none";
const field_cardNumber = document.querySelector("#cc-num");
const field_zip = document.querySelector("#zip");
const field_CVV = document.querySelector("#cvv");

const div_colors = document.querySelector("#colors-js-puns");
const div_paymentOptions = document.querySelectorAll(".payment-option");

const set_shirt = document.querySelector("#shirt");
const set_activities = document.querySelector(".activities");

//a running total for the amount the user owes
const span_runningTotal = document.createElement("span");
    set_activities.appendChild(span_runningTotal);

//messages to be displayed when user submits an invalid form
const errorMessages =
{
    blankName: "Please enter a name.",
    blankEmail: "Please enter a email.",
    blankJobRole: "Please enter a job role.",
    blankCardNumber: "Please enter a card.",
    blankZip: "Please enter a zip.",
    blankCVV: "Please enter a CVV.",
    invalidEmail: "Invalid email entered.",
    noSelectedActivity: "Please select at least one activity.",
    noSelectedShirt: "Please select a shirt.",
    nonNumericValue: "Non-number entered",
    cardNumberLength: "13-16 characters only",
    zipLength: "5 characters only.",
    CVVLength: "3 characters only."
};


//functions

/* description - changes visibility and content of color drop-down selector
                 based on the what theme the user has selected
paramaters: - theme    - (string) the currently selected theme
            - colors   - (element) the drop-down selector the used to select
                          shirt color
            - colorDiv - (element) the container for everything t-shirt
*/ function setColorTheme(theme, colors, colorDiv)
{
    //determines whether to hide or show color selection based on user selection
    colorDiv.style.display = (theme === "unselected") ? ("none") : ("");

    for(let index = 0; index < colors.length; index++)
    {
        const color = colors[index];
        const colorClass = color.className;

        //determines which shirt colors to show based on user selection
        color.style.display = (theme === colorClass) ? ("") : ("none");
    }
}

/* descripion - constructs an object consisting of all the necessary information
                about a given activity
paramaters: - unparsedString - (string) the activity info formated as follows:
                               "{price}-{day}-{start}-{end}"
*/ function constructActivityObject(unparsedString)
{
    //parses string input
    const split = unparsedString.split("-");

    //validates the string has the correct number of values
    if(split.length === 4)
    {
        //constructs object
        let object =
        {
            price: parseInt(split[0]),
            day: split[1],
            start: parseInt(split[2]),
            end: parseInt(split[3])
        };
        return object;
    }
    return;
}

/* description - updates page to display a selected payment option
                 (0 = credit card - 1 = paypal - 2 = bitcoin)
paramaters: - index   - (integer) the index for "options" determining which
                        option to display
            - options - (element[]) a collection of divs representing different
                        payment options
*/ function displayPaymentOption(index, options)
{
    for(let i = 0; i < options.length; i++)
    {
        //determines whether to show or hide payment option
        options[i].style.display = (index === i) ? ("") : ("none");
    }
}

/* description - verifies the user correctly entered a name
paramaters: - name - (string) the name entered by user
returns - results - (object) an object which contains whether the name "isValid"
                    and an "errorMessage" if it's not
*/ function verifyName(name)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies name isn't blank
    if(name === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankName"];
    }
    return results;
}

/* description - verifies the user correctly entered an email
paramaters: - email - (string) the email entered by user
returns - results - (object) an object which contains whether the email
                    "isValid" and an "errorMessage" if it's not
*/ function verifyEmail(email)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies email is properly formatted
    if(email.includes("@") && email.includes("."))
    {
        let split = email.split("@");

        if(split.length === 2)
        {
            if(split[0].length > 0 && split[1].length > 0)
            {
                split = split[1].split(".");

                console.log(split.length);

                if(split.length == 2)
                {
                    if(split[0].length > 0 && split[1].length > 0)
                    {
                        return results;
                    }
                }
            }
        }
    }
    results.isValid = false;

    //if invalid, determines whether email is empty or misentered
    if(email === "")
    {
        results.errorMessage = errorMessages["blankEmail"];
    }
    else
    {
        results.errorMesssage = errorMessages["invalidEmail"];
    }
    return results;
}


/* description - verifies the user correctly selected a job role
paramaters: - jobRole - (string) the job role selected by user
            - otherValue  - (string) the value entered in optional text field
returns - results - (object) an object which contains whether the user's job
                    role selection "isValid" and an "errorMessage" if it's not
*/ function verifyJobRoleSelection(jobRole, otherValue)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies that if jobRole "other" is selected that the value entered
    //in the text field isn't blank
    if(jobRole === "other" && otherValue === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankJobRole"];
    }
    return results;
}

/* description - verifies the user correctly entered a shirt color
paramaters: - design - (string) the design selected by user
            - color  - (string) the color selected by user
returns - results - (object) an object which contains whether the user's shirt
                    selection "isValid" and an "errorMessage" if it's not
*/ function verifyShirtSelection(design, color)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies that design and color were properly selected by user
    if(design === "Select Theme" || color === "Select Color")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["noSelectedShirt"];
    }
    return results;
}

/* description - verifies the user selected at least one activity
paramaters: - checkboxes - (element[]) a collection of input checkbox elements
                           to check
returns - results - (object) an object which contains whether the user's
                    activity select "isValid" and an "errorMessage" if it's not
*/ function verifyActivitySelection(checkboxes)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //iterates through checkboxes and returns if and when a checkbox is selected
    for(let x = 0; x < checkboxes.length; x++)
    {
        if(checkboxes[x].checked)
        {
            return results;
        }
    }
    //if this code is reached without returning, then no checkbox was selected
    //and the result of invalid is returned
    results.isValid = false;
    results.errorMessage = errorMessages["noSelectedActivity"];
    return results;
}

/* description - verifies the user correctly entered a card number
paramaters: - number - (string) the card number entered by user
returns - results - (object) an object which contains whether the card number
                    "isValid" and an "errorMessage" if it's not
*/ function verifyCardNumber(number)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies that card number isn't blank
    if(number === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankCardNumber"];
    }
    //verifies that card number only contains numeric characters
    else if(isNaN(number))
    {
        results.isValid = false;
        results.errorMessage = errorMessages["nonNumericValue"];
    }
    //verifies that card number is the proper length
    else if(number.length < 13 || number.length > 16)
    {
        results.isValid = false;
        results.errorMessage = errorMessages["cardNumberLength"];
    }
    return results;
}

/* description - verifies the user correctly entered a zip
paramaters: - zip - (string) the zip entered by user
returns - results - (object) an object which contains whether the zip "isValid"
                    and an "errorMessage" if it's not
*/ function verifyZip(zip)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies that zip ins't blank
    if(zip === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankZip"];
    }
    //verifies that zip only contains numeric characters
    else if(isNaN(zip))
    {
        results.isValid = false;
        results.errorMessage = errorMessages["nonNumericValue"];
    }
    //verifies that zip is the proper length
    else if(zip.length != 5)
    {
        results.isValid = false;
        results.errorMessage = errorMessages["zipLength"];
    }
    return results;
}

/* description - verifies the user correctly entered a CVV
paramaters: - CVV - (string) the CVV entered by user
returns - results - (object) an object which contains whether the CVV "isValid"
                    and an "errorMessage" if it's not
*/ function verifyCVV(CVV)
{
    //object construction
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    //verifies CVV isn't blank
    if(CVV === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankCVV"];
    }
    //verifies CVV only contains numeric characters
    else if(isNaN(CVV))
    {
        results.isValid = false;
        results.errorMessage = errorMessages["nonNumericValue"];
    }
    //verifies CVV is the proper length
    else if(CVV.length != 3)
    {
        results.isValid = false;
        results.errorMessage = errorMessages["CVVLength"];
    }
    return results;
}

/* description - is called when the form submitted has an error and displays an
                 indicator for the user, showing where the problem is and what
                 the problem is
paramaters: - target       - (element) the element where the error occurs
            - errorMessage - (string) the errorMessage to display to the user
                             (by design  this argument should be used in
                             conjunction with the object field "errorMessages")
*/ function handleSubmissionError(target, errorMessage)
{
    //error handling for all fieldset elements
    if(target.tagName === "FIELDSET" && target.querySelectorAll(".error-fieldset").length === 0)
    {
        const errorContainer = document.createElement("div");
        const errorStrong = document.createElement("strong");

        //sets class names so external css will properly style the error
        errorContainer.className = "error-container";
        errorStrong.className = "error-fieldset";
        errorStrong.textContent = errorMessage;

        errorContainer.appendChild(errorStrong);
        target.appendChild(errorContainer);
    }
    //error handling for all input elements
    else if(target.tagName === "INPUT")
    {
        //error handling for all input elements of type "text" or "email"
        if(target.type === "text" || target.type === "email")
        {
            //manually sets border color to red
            target.style.border = "2px solid red";
            //clears what the user entered
            target.value = "";
            //display error message via the inputs place holder text
            target.placeholder = errorMessage;
        }
    }
}

/* description - detects the input the user entered and changes text field
                 border color to indicate to the user the validity of their
                 entry
paramaters: - field    - (element) an input to validate
            - verifier - (function) a function to validate user's entry (such as
                         "verifyName" or "verifyEmail")
            - focused  - (boolean) a value that states whether the user has
                         has the input selected/focused
*/ function performTextfieldValidation(field, verifier, focused)
{
    const value = field.value;
    const verification = verifier(value);

    //when the text field is focused
    if(focused)
    {
        //when the text field isn't blank
        if(value.length > 0)
        {
            //sets border to red when entry is invalid
            if(!verification.isValid)
            {
                field.style.border = "2px solid red";
            }
            //and green when valid
            else
            {
                field.style.border = "2px solid lightgreen";
            }
        }
        //removes border if entry is blank
        else
        {
            field.style.border = "0";
        }
    }
    //when the text field is unfocused
    else
    {
        //sets border to red when entry is invalid and not blank
        if(!verification.isValid && value.length > 0)
        {
            field.style.border = "2px solid red";
        }
        //removes border otherwise
        else
        {
            field.style.border = "0";
        }
    }
}

//handlers


//handler when form is submitted
form.addEventListener("submit", event =>
{
    //a boolean set to true if form shouldn't submit
    let preventDefault = false;

    //retrieval of all verifications
    const nameVerification = verifyName(field_name.value);
    const emailVerification = verifyEmail(field_mail.value);
    const jobRoleVerification = verifyJobRoleSelection(select_jobRole.value, field_jobRole.value);
    const shirtVerification = verifyShirtSelection(select_design.value, select_color.value);
    const activityVerification = verifyActivitySelection(set_activities.querySelectorAll("input"));
    const cardNumberVerification = verifyCardNumber(field_cardNumber.value);
    const zipVerification = verifyZip(field_zip.value);
    const CVVVerification = verifyCVV(field_CVV.value);

    //checks whether verifications are set to invalid, then handles the error
    if(!nameVerification.isValid)
    {
        handleSubmissionError(field_name, nameVerification.errorMessage);
        preventDefault = true;
    }
    if(!emailVerification.isValid)
    {
        handleSubmissionError(field_mail, emailVerification.errorMessage);
        preventDefault = true;
    }
    if(!jobRoleVerification.isValid)
    {
        handleSubmissionError(field_jobRole, jobRoleVerification.errorMessage);
        preventDefault = true;
    }
    if(!shirtVerification.isValid)
    {
        handleSubmissionError(set_shirt, shirtVerification.errorMessage);
        preventDefault = true;
    }
    if(!activityVerification.isValid)
    {
        handleSubmissionError(set_activities, activityVerification.errorMessage);
        preventDefault = true;
    }
    if(select_payment.value === "credit card")
    {
        if(!cardNumberVerification.isValid)
        {
            handleSubmissionError(field_cardNumber, cardNumberVerification.errorMessage);
            preventDefault = true;
        }
        if(!zipVerification.isValid)
        {
            handleSubmissionError(field_zip, zipVerification.errorMessage);
            preventDefault = true;
        }
        if(!CVVVerification.isValid)
        {
            handleSubmissionError(field_CVV, CVVVerification.errorMessage);
            preventDefault = true;
        }
    }
    //prevents form submission if error was found
    if(preventDefault)
    {
        event.preventDefault();
    }
});

//a sequence of handlers that checks the validity of a text field entry whenever
//a text field is changed or unfocused
field_name.addEventListener("keyup", event =>
{
    performTextfieldValidation(field_name, verifyName, true);
});

field_name.addEventListener("blur", event =>
{
    performTextfieldValidation(field_name, verifyName, false);
});

field_mail.addEventListener("keyup", event =>
{
    performTextfieldValidation(field_mail, verifyEmail, true);
});

field_mail.addEventListener("blur", event =>
{
    performTextfieldValidation(field_mail, verifyEmail, false);
});

field_jobRole.addEventListener("keyup", event =>
{
    performTextfieldValidation(field_jobRole, verifyJobRoleSelection, true);
});

field_jobRole.addEventListener("blur", event =>
{
    performTextfieldValidation(field_jobRole, verifyJobRoleSelection, false);
});

field_cardNumber.addEventListener("keyup", event =>
{
    performTextfieldValidation(field_cardNumber, verifyCardNumber, true);
});

field_cardNumber.addEventListener("blur", event =>
{
    performTextfieldValidation(field_cardNumber, verifyCardNumber, false);
});

field_zip.addEventListener("keyup", event =>
{
    performTextfieldValidation(field_zip, verifyZip, true);
});

field_zip.addEventListener("blur", event =>
{
    performTextfieldValidation(field_zip, verifyZip, false);
});

field_CVV.addEventListener("keyup", event =>
{
    performTextfieldValidation(field_CVV, verifyCVV, true);
});

field_CVV.addEventListener("blur", event =>
{
    performTextfieldValidation(field_CVV, verifyCVV, false);
});

//handler for whenever the user makes selects or unselects an activity
set_activities.addEventListener("change", event =>
{
    //the checkboxes
    const activities = set_activities.querySelectorAll("input");
    //the target element
    const target = event.target;
    const targetIsChecked = target.checked;
    //the data to compare with all other checkboxes
    const targetData = constructActivityObject(target.value);
    //determines if the selection of the "target" checkbox could create a conflict with events at the same time
    const checkForConflict = target.type === "checkbox" && !(targetData.day === "N/A" || targetData.start === "N/A" || targetData.end === "N/A" || targetData === null)

    //running total for the amount the user owes
    let runningTotal = 0;

    //disables checkboxes that conflict with checkboxes already selected
    for(let index = 0; index < activities.length; index++)
    {
        //the current checkbox in the loop
        const comparison = activities[index];
        const comparisonIsChecked = comparison.checked;
        //the data for "comparison" to compare with "targetData"
        const comparedData = constructActivityObject(comparison.value);

        if(checkForConflict)
        {
            //ensures the comparison and the target aren't the same checkbox
            if(target.name !== comparison.name)
            {
                //checks if the days are the same
                if(targetData.day === comparedData.day)
                {
                    //checks if the time frames conflict
                    if((targetData.start <= comparedData.start && targetData.end >= comparedData.start)
                    || (targetData.start <= comparedData.end && targetData.end >= comparedData.end)
                    || (targetData.start >= comparedData.start && targetData.end <= comparedData.end))
                    {
                        //if all conditions are true, the checkbox is disabled
                        comparison.disabled = targetIsChecked;
                    }
                }
            }
        }
        //a running calculation of how much the user owes
        runningTotal += (comparisonIsChecked) ? (comparedData.price) : 0;
    }
    //updates page to display the amount the user owes
    span_runningTotal.textContent = (runningTotal > 0) ? ("Total: $" + runningTotal) : ("");

    //if error message is currently being displayed, it is removed
    if(set_activities.querySelectorAll(".error-container").length > 0)
    {
        set_activities.removeChild(set_activities.querySelector(".error-container"));
    }
});

//handler that displays or hides a text field where the user can enter an
//alternative job based on if the user has "other" selected as a job role
select_jobRole.addEventListener("change", event =>
{
    field_jobRole.style.display = (select_jobRole.value === "other") ? ("") : ("none");
});

//handler that updates t-shirt selection based on what the user already has
//selected
select_design.addEventListener("change", event =>
{
    const theme = select_design.value;
    const colors = select_color.children;

    setColorTheme(theme, colors, div_colors);

    colors[0].selected = true;
});

//handler that changes the displayed payment option based on which payment
//option the user has selected
select_payment.addEventListener("change", event =>
{
    const index = select_payment.selectedIndex;

    displayPaymentOption(index, div_paymentOptions);
});

//handler that detects when a t-shirt color is selected and removes an error
//message if one is present
select_color.addEventListener("change", event =>
{
    if(set_shirt.querySelectorAll(".error-container").length > 0)
    {
        set_shirt.removeChild(set_shirt.querySelector(".error-container"));
    }
});

//initialization

setColorTheme(select_design.value, select_color.children, div_colors);
displayPaymentOption(0, div_paymentOptions);

//sets focus on the first text field
field_name.focus();
