function convertirBinarioADecimal(binario) {
    let total = 0;
    let procedimiento = [];

    let potencia = 0;

    for (let i = binario.length - 1; i >= 0; i--) {
        let bit = parseInt(binario[i]);
        let valorPotencia = Math.pow(2, potencia);
        let resultado = valorPotencia * bit;

        procedimiento.push("2^" + potencia + " x " + bit + " = " + resultado);

        total += resultado;
        potencia++;
    }

    let fitness = total * total;

    return {
        decimal: total,
        procedimiento: procedimiento,
        fitness: fitness
    };
}

function renderProcedimiento(calculo) {
    let html = "";

    calculo.procedimiento.forEach((linea) => {
        html += '<div class="calc-line">' + linea + "</div>";
    });

    html += '<div class="calc-line calc-result">x = ' + calculo.decimal + "</div>";
    html += '<div class="calc-line calc-fitness">Fitness = x&sup2; = ' + calculo.fitness + "</div>";

    return html;
}

const resultadoNode = document.getElementById("lblResultado");
const defaultResultadoHTML = resultadoNode ? resultadoNode.innerHTML : "";

function clearResultPanel() {
    if (resultadoNode) {
        resultadoNode.innerHTML = defaultResultadoHTML;
    }
}

function setInvalid(input, message) {
    if (!input) {
        return;
    }

    const feedbackId = input.id === "txtPadre" ? "feedbackPadre"
        : input.id === "txtMadre" ? "feedbackMadre"
            : "feedbackPunto";
    const feedback = document.getElementById(feedbackId);

    input.classList.add("is-invalid");
    if (feedback) {
        feedback.textContent = message;
    }
}

function clearInvalid(input) {
    if (!input) {
        return;
    }

    const feedbackId = input.id === "txtPadre" ? "feedbackPadre"
        : input.id === "txtMadre" ? "feedbackMadre"
            : "feedbackPunto";
    const feedback = document.getElementById(feedbackId);

    input.classList.remove("is-invalid");
    if (feedback) {
        feedback.textContent = "";
    }
}

function validarCampos(showAll) {
    const padre = document.getElementById("txtPadre");
    const madre = document.getElementById("txtMadre");
    const puntoCorte = document.getElementById("txtPuntoCorte");

    const padreValor = padre ? padre.value.trim() : "";
    const madreValor = madre ? madre.value.trim() : "";
    const puntoValor = puntoCorte ? puntoCorte.value.trim() : "";

    let valido = true;

    clearInvalid(padre);
    clearInvalid(madre);
    clearInvalid(puntoCorte);

    const binarioRegex = /^[01]+$/;

    if (!padreValor) {
        if (showAll) {
            setInvalid(padre, "Este campo es obligatorio.");
            valido = false;
        } else {
            valido = false;
        }
    } else if (!binarioRegex.test(padreValor)) {
        setInvalid(padre, "Solo se permiten números binarios (0 y 1)." );
        valido = false;
    }

    if (!madreValor) {
        if (showAll) {
            setInvalid(madre, "Este campo es obligatorio.");
            valido = false;
        } else {
            valido = false;
        }
    } else if (!binarioRegex.test(madreValor)) {
        setInvalid(madre, "Solo se permiten números binarios (0 y 1)." );
        valido = false;
    }

    if (padreValor && madreValor && binarioRegex.test(padreValor) && binarioRegex.test(madreValor)) {
        if (padreValor.length !== madreValor.length) {
            setInvalid(padre, "Los cromosomas deben tener la misma longitud.");
            setInvalid(madre, "Los cromosomas deben tener la misma longitud.");
            valido = false;
        }
    }

    if (!puntoValor) {
        if (showAll) {
            setInvalid(puntoCorte, "Este campo es obligatorio.");
            valido = false;
        } else {
            valido = false;
        }
    } else {
        const puntoNumero = parseInt(puntoValor, 10);
        const limite = padreValor && binarioRegex.test(padreValor) ? padreValor.length : 0;

        if (!Number.isInteger(puntoNumero)) {
            setInvalid(puntoCorte, "El punto de corte debe ser un número entero.");
            valido = false;
        } else if (limite > 0 && (puntoNumero <= 0 || puntoNumero >= limite)) {
            setInvalid(puntoCorte, "El punto de corte debe estar entre 1 y " + (limite - 1) + ".");
            valido = false;
        }
    }

    return valido;
}

function handleRealtimeValidation() {
    const valido = validarCampos(false);

    if (!valido) {
        clearResultPanel();
    }
}

const padreInput = document.getElementById("txtPadre");
const madreInput = document.getElementById("txtMadre");
const puntoInput = document.getElementById("txtPuntoCorte");

if (padreInput) {
    padreInput.addEventListener("input", handleRealtimeValidation);
}

if (madreInput) {
    madreInput.addEventListener("input", handleRealtimeValidation);
}

if (puntoInput) {
    puntoInput.addEventListener("input", handleRealtimeValidation);
}

function reiniciarCalculo() {
    const campos = [padreInput, madreInput, puntoInput];

    campos.forEach((campo) => {
        if (campo) {
            campo.value = "";
            clearInvalid(campo);
        }
    });

    clearResultPanel();

    if (padreInput) {
        padreInput.focus();
    }
}

function calularCruce() {
    let padre = document.getElementById("txtPadre");
    let madre = document.getElementById("txtMadre");
    let puntoCorte = document.getElementById("txtPuntoCorte");
    let resultado = document.getElementById("lblResultado");

    if (!validarCampos(true)) {
        clearResultPanel();
        return;
    }

    let padreParte1 = padre.value.substring(0, puntoCorte.value);
    let padreParte2 = padre.value.substring(puntoCorte.value);

    let madreParte1 = madre.value.substring(0, puntoCorte.value);
    let madreParte2 = madre.value.substring(puntoCorte.value);

    let hijo1 = padreParte1 + madreParte2;
    let hijo2 = madreParte1 + padreParte2;

    let calculoHijo1 = convertirBinarioADecimal(hijo1);
    let calculoHijo2 = convertirBinarioADecimal(hijo2);

    resultado.innerHTML =
        '<div class="result-stack">' +
        '<div class="result-row result-father">' +
        '<span class="result-label">Padre</span>' +
        '<span class="result-value">' + padreParte1 + " | " + padreParte2 + "</span>" +
        "</div>" +
        '<div class="result-row result-mother">' +
        '<span class="result-label">Madre</span>' +
        '<span class="result-value">' + madreParte1 + " | " + madreParte2 + "</span>" +
        "</div>" +
        '<div class="result-row result-child-one">' +
        '<span class="result-label">Hijo 1</span>' +
        '<span class="result-value">' + hijo1 + "</span>" +
        "</div>" +
        '<div class="result-row result-child-two">' +
        '<span class="result-label">Hijo 2</span>' +
        '<span class="result-value">' + hijo2 + "</span>" +
        "</div>" +
        '<div class="result-actions">' +
        '<button class="btn btn-outline-light btn-sm calc-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#calcHijo1" aria-expanded="false" aria-controls="calcHijo1">Ver cálculo Hijo 1</button>' +
        '<button class="btn btn-outline-light btn-sm calc-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#calcHijo2" aria-expanded="false" aria-controls="calcHijo2">Ver cálculo Hijo 2</button>' +
        "</div>" +
        '<div class="collapse" id="calcHijo1">' +
        '<div class="calc-panel">' +
        '<div class="calc-title calc-title-one">Cálculo Hijo 1</div>' +
        renderProcedimiento(calculoHijo1) +
        "</div>" +
        "</div>" +
        '<div class="collapse" id="calcHijo2">' +
        '<div class="calc-panel">' +
        '<div class="calc-title calc-title-two">Cálculo Hijo 2</div>' +
        renderProcedimiento(calculoHijo2) +
        "</div>" +
        "</div>" +
        "</div>";
}
