//fields

const form = document.querySelector("form");

const select_design = document.querySelector("#design");
const select_color = document.querySelector("#color");
const select_jobRole = document.querySelector("#title");
const select_payment = document.querySelector("#payment");

const field_name = document.querySelector("#name");
const field_mail = document.querySelector("#mail");
const field_jobRole = document.createElement("input");
    field_jobRole.type = "text";
    field_jobRole.id = "other-title";
    field_jobRole.placeholder = "Your Job Role";
    select_jobRole.parentNode.appendChild(field_jobRole);
    field_jobRole.style.display = "none";
const field_cardNumber = document.querySelector("#cc-num");
const field_zip = document.querySelector("#zip");
const field_CVV = document.querySelector("#cvv");


const div_colors = document.querySelector("#colors-js-puns");
const div_paymentOptions = document.querySelectorAll(".payment-option");

const set_shirt = document.querySelector("#shirt");
const set_activities = document.querySelector(".activities");

let runningTotal = 0;
const span_runningTotal = document.createElement("span");
    span_runningTotal.textContent = "Total: $" + runningTotal;
    set_activities.appendChild(span_runningTotal);

const errorMessages =
{
    blankName: "Please enter a name.",
    blankEmail: "Please enter a email.",
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

function setColorTheme(theme, colors, colorDiv)
{
    colorDiv.style.display = (theme === "unselected") ? ("none") : ("");

    for(let index = 0; index < colors.length; index++)
    {
        const color = colors[index];
        const colorClass = color.className;

        color.style.display = (theme === colorClass) ? ("") : ("none");
    }
}

function constructActivityObject(string)
{
    const split = string.split("-");

    if(split.length === 4)
    {
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

function displayPaymentOption(index, options)
{
    for(let i = 0; i < options.length; i++)
    {
        options[i].style.display = (index === i) ? ("") : ("none");
    }
}

function verifyName(name)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    if(name === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankName"];
    }
    return results;
}

function verifyEmail(email)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    if(email.includes("@"))
    {
        const split = email.split("@");

        if(split.length === 2)
        {
            if(split[0].length > 0 && split[1].length > 0)
            {
                return results;
            }
        }
    }
    results.isValid = false;

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

function verifyShirtSelection(design, color)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    if(design === "Select Theme" || color === "Select Color")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["noSelectedShirt"];
    }
    return results;
}

function verifyActivitySelection(checkboxes)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    for(let x = 0; x < checkboxes.length; x++)
    {
        if(checkboxes[x].checked)
        {
            return results;
        }
    }
    results.isValid = false;
    results.errorMessage = errorMessages["noSelectedActivity"];
    return results;
}

function verifyCardNumber(number)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    if(number === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankCardNumber"];
    }
    else if(isNaN(number))
    {
        results.isValid = false;
        results.errorMessage = errorMessages["nonNumericValue"];
    }
    else if(number.length < 13 || number.length > 16)
    {
        results.isValid = false;
        results.errorMessage = errorMessages["cardNumberLength"];
    }
    return results;
}

function verifyZip(zip)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    if(zip === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankZip"];
    }
    else if(isNaN(zip))
    {
        results.isValid = false;
        results.errorMessage = errorMessages["nonNumericValue"];
    }
    else if(zip.length != 5)
    {
        results.isValid = false;
        results.errorMessage = errorMessages["zipLength"];
    }
    return results;
}

function verifyCVV(cvv)
{
    let results =
    {
        isValid: true,
        errorMessage: ""
    };
    if(cvv === "")
    {
        results.isValid = false;
        results.errorMessage = errorMessages["blankCVV"];
    }
    else if(isNaN(cvv))
    {
        results.isValid = false;
        results.errorMessage = errorMessages["nonNumericValue"];
    }
    else if(cvv.length != 3)
    {
        results.isValid = false;
        results.errorMessage = errorMessages["cvvLength"];
    }
    return results;
}

function handleSubmissionError(target, errorMessage)
{
    if(target.tagName === "FIELDSET")
    {
        const errorMessageContainer = document.createElement("div");
        const errorMessageStrong = document.createElement("strong");

        errorMessageContainer.className = "error-message-container";
        errorMessageStrong.className = "error-message";
        errorMessageStrong.textContent = errorMessage;

        errorMessageContainer.appendChild(errorMessageStrong);
        target.appendChild(errorMessageContainer);
    }
    else if(target.tagName === "INPUT")
    {
        if(target.type === "text" || target.type === "email")
        {
            target.style.border = "2px solid red";
            target.value = "";
            target.placeholder = errorMessage;
        }
    }
}

function performTextfieldValidation(field, verifier, focused)
{
    const value = field.value;
    const verification = verifier(value);

    if(focused)
    {
        if(value.length > 0)
        {
            if(!verification.isValid)
            {
                field.style.border = "2px solid red";
            }
            else
            {
                field.style.border = "2px solid lightgreen";
            }
        }
        else
        {
            field.style.border = "0";
        }
    }
    else
    {
        if(!verification.isValid && value.length > 0)
        {
            field.style.border = "2px solid red";
        }
        else
        {
            field.style.border = "0";
        }
    }
}

//handlers


form.addEventListener("submit", event =>
{

    let preventDefault = false;

    const nameVerification = verifyName(field_name.value);
    const emailVerification = verifyEmail(field_mail.value);
    const shirtVerification = verifyShirtSelection(select_design.value, select_color.value);
    const activityVerification = verifyActivitySelection(set_activities.querySelectorAll("input"));
    const cardNumberVerification = verifyCardNumber(field_cardNumber.value);
    const zipVerification = verifyZip(field_zip.value);
    const CVVVerification = verifyCVV(field_CVV.value);

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
    if(preventDefault)
    {
        event.preventDefault();
    }
});

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

select_jobRole.addEventListener("change", event =>
{
    field_jobRole.style.display = (select_jobRole.value === "other") ? ("") : ("none");
});

select_design.addEventListener("change", event =>
{
    const theme = select_design.value;
    const colors = select_color.children;

    setColorTheme(theme, colors, div_colors);

    colors[0].selected = true;
});

set_activities.addEventListener("change", event =>
{
    const activities = set_activities.querySelectorAll("input");
    const target = event.target;
    const targetIsChecked = target.checked;
    const targetData = constructActivityObject(target.value);

    runningTotal += (targetIsChecked) ? (targetData.price) : (-targetData.price);
    span_runningTotal.textContent = "Total: $" + runningTotal;

    if(target.type === "checkbox" && !(targetData.day === "N/A" || targetData.start === "N/A" || targetData.end === "N/A" || targetData === null))
    {
        for(let index = 0; index < activities.length; index++)
        {
            const comparison = activities[index];
            const comparedData = constructActivityObject(comparison.value);

            if(target.name !== comparison.name)
            {
                if(targetData.day === comparedData.day)
                {
                    if((targetData.start <= comparedData.start && targetData.end >= comparedData.start)
                    || (targetData.start <= comparedData.end && targetData.end >= comparedData.end)
                    || (targetData.start >= comparedData.start && targetData.end <= comparedData.end))
                    {
                        comparison.disabled = targetIsChecked;
                    }
                }
            }
        }
    }
    if(set_activities.querySelectorAll(".error-message-container").length > 0)
    {
        set_activities.removeChild(set_activities.querySelector(".error-message-container"));
    }
});

select_color.addEventListener("change", event =>
{
    if(set_shirt.querySelectorAll(".error-message-container").length > 0)
    {
        set_shirt.removeChild(set_shirt.querySelector(".error-message-container"));
    }
});

select_payment.addEventListener("change", event =>
{
    const index = select_payment.selectedIndex;

    displayPaymentOption(index, div_paymentOptions);
});

//initialization

setColorTheme(select_design.value, select_color.children, div_colors);
displayPaymentOption(0, div_paymentOptions);

field_name.focus();
