import { validateAdoptionRules } from './formulario.js';


// Configuración de Supabase

const SUPABASE_URL = 'https://tdvvmusnlumltrctausl.supabase.co'; // Tu URL real
const SUPABASE_ANON_KEY = 'sb_publishable_R59ii3WGhJoU8KVILWgCSQ_EWl7894w'; // Tu Anon Key real

let supabaseClient = null; // Empezamos vacío

// Elementos de la interfaz
const btnInicio = document.getElementById('btn-inicio');
const btnPerros = document.getElementById('btn-perros');
const seccionInicio = document.getElementById('seccion-inicio');
const seccionPerros = document.getElementById('seccion-perros');
const contenedorPerros = document.getElementById('contenedor-perros');

//guarda el perro actual para el formulario
let perroSeleccionadoActivo = null; // Guarda el perro actual para el filtro


// Navegación de pestañas
btnInicio.addEventListener('click', () => {
    btnInicio.className = 'btn-active';
    btnPerros.className = 'btn-inactive';
    seccionInicio.className = 'section-visible';
    seccionPerros.className = 'section-hidden';
});

btnPerros.addEventListener('click', () => {
    btnPerros.className = 'btn-active';
    btnInicio.className = 'btn-inactive';
    seccionPerros.className = 'section-visible';
    seccionInicio.className = 'section-hidden';
    
    if (!supabaseClient && typeof supabasejs !== 'undefined') {
        supabaseClient = supabasejs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (!supabaseClient && typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    
    fetchDogs();
});

// Listener para el botón "Back to Catalog" dentro del formulario
document.getElementById('btn-volver-catalogo').addEventListener('click', () => {
    // Al volver, nos aseguramos de que el formulario esté listo y limpio para la próxima vez
    document.getElementById('adoption-form').style.display = 'flex';
    document.getElementById('feedback-container').style.display = 'none';
    document.getElementById('adoption-form').reset();
    
    // Cambiamos de vista regresando a las tarjetas
    btnPerros.className = 'btn-active';
    btnInicio.className = 'btn-inactive';
    seccionPerros.className = 'section-visible';
    seccionInicio.className = 'section-hidden';
    document.getElementById('seccion-formulario').className = 'section-hidden';
});


// Consulta directa usando FETCH nativo (Sin librerías)
async function fetchDogs() {
    try {
        contenedorPerros.innerHTML = '<p>Cargando perros desde la API...</p>';

        // Construimos la URL apuntando directamente a tu tabla 'dogs' con el orden deseado
       const urlAPI = `${SUPABASE_URL}/rest/v1/dogs?select=id,name,gender,size,status,photo_url,activity_level,medical_needs,birth_date,dog_compatible,cat_compatible,child_compatible,beginer_compatible,descripcion&order=created_at.desc`;

        // Petición HTTP nativa con las cabeceras de seguridad requeridas por Supabase
        const respuesta = await fetch(urlAPI, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error de servidor: ${respuesta.status} ${respuesta.statusText}`);
        }

        const dogs = await respuesta.json();

        if (!dogs || dogs.length === 0) {
            contenedorPerros.innerHTML = '<p>No hay perros disponibles en este momento.</p>';
            return;
        }

        contenedorPerros.innerHTML = '';

        // Renderizado dinámico idéntico a tu diseño
        dogs.forEach(dog => {
            let ageDisplay = 'Unknown age';
            if (dog.birth_date) {
                const birth = new Date(dog.birth_date);
                const today = new Date();
                
                // 1. Calculamos la diferencia total en meses
                let totalMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
                if (today.getDate() < birth.getDate()) {
                    totalMonths--; // Ajuste si aún no ha llegado al día del mes de nacimiento
                }

                // 2. Clasificamos según el resultado
                if (totalMonths < 0) {
                    ageDisplay = 'Puppy (Newborn)';
                } else if (totalMonths < 12) {
                    // Si tiene menos de un año, mostramos los meses exactos
                    ageDisplay = totalMonths === 1 ? 'Puppy (1 month old)' : `Puppy (${totalMonths} months old)`;
                } else {
                    // Si tiene un año o más, calculamos los años correspondientes
                    const ageYears = Math.floor(totalMonths / 12);
                    ageDisplay = ageYears === 1 ? '1 year old' : `${ageYears} years old`;
                }
            }

            const card = document.createElement('div');
            card.className = 'card-perro';

            card.innerHTML = `
                <div class="img-perro">
                    <img src="${dog.photo_url || 'https://placeholder.com'}" alt="${dog.name}">
                </div>
                <div class="info-perro" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <h3 style="margin: 0;">${dog.name}</h3>
                    <p class="descripcion-corta" style="color: #16a34a; font-weight: 600; font-size: 0.875rem; margin: 0;">${dog.status}</p>
                    
                    <!-- Core Traits -->
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                        <span style="background-color: #dcfce7; color: #16a34a; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">Size: ${dog.size}</span>
                        <span style="background-color: #dcfce7; color: #16a34a; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">Gender: ${dog.gender}</span>
                        <span style="background-color: #dcfce7; color: #16a34a; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">Age: ${ageDisplay}</span>
                        <span style="background-color: #dcfce7; color: #16a34a; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">Energy: ${dog.activity_level}</span>
                    </div>

                    <!-- Descripción Larga (Siempre visible) -->
                    <div style="border-top: 1px solid #f3f4f6; padding-top: 0.5rem; margin-top: 0.25rem;">
                        <p style="font-size: 0.75rem; color: #6b7280; margin: 0;"><strong>Description:</strong></p>
                        <p style="font-size: 0.875rem; color: #4b5563; line-height: 1.4; margin: 0.25rem 0;">
                            ${dog.descripcion ? dog.descripcion : 'No description available yet.'}
                        </p>
                    </div>

                    <!-- Compatibilidades en Burbujas con Emojis -->
                    <div style="border-top: 1px solid #f3f4f6; padding-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
                        <p style="font-size: 0.75rem; color: #6b7280; margin: 0;"><strong>Compatibility:</strong></p>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                            <span style="background-color: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">🐕 Dogs: ${dog.dog_compatible}</span>
                            <span style="background-color: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">🐈 Cats: ${dog.cat_compatible}</span>
                            <span style="background-color: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">👶 Kids: ${dog.child_compatible}</span>
                        </div>
                    </div>
                </div>
                <button class="btn-adoptar" style="margin-top: 0.75rem;">Adopt</button>
            `;

            contenedorPerros.appendChild(card);
                     // Escuchamos el botón "Adopt" de esta tarjeta específica
            const btnAdoptar = card.querySelector('.btn-adoptar');
            btnAdoptar.addEventListener('click', () => {
                perroSeleccionadoActivo = dog;
                document.getElementById('form-dog-id').value = dog.id;
                
                document.getElementById('adoption-form').style.display = 'flex';
                document.getElementById('feedback-container').style.display = 'none';
                document.getElementById('adoption-form').reset();
                
                // Switch visual de las vistas
                seccionInicio.className = 'section-hidden';
                seccionPerros.className = 'section-hidden';
                document.getElementById('seccion-formulario').className = 'section-visible';
            });

            contenedorPerros.appendChild(card);
        }); // Cierre de dogs.forEach

    } catch (error) {
        console.error('Error en fetch:', error);
        contenedorPerros.innerHTML = `<p style="color: #b91c1c;">Error de conexión: ${error.message}</p>`;
    }
} 

// Escuchador global para el envío del formulario de adopción
const formularioAdoption = document.getElementById('adoption-form');
const feedbackContainer = document.getElementById('feedback-container');

formularioAdoption.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!perroSeleccionadoActivo) return;

    const formDataInstance = new FormData(formularioAdoption);
    const formValues = Object.fromEntries(formDataInstance.entries());

        // Forzamos la validación nativa de campos obligatorios en el navegador
    if (!formularioAdoption.checkValidity()) {
        formularioAdoption.reportValidity(); // Muestra el globito de advertencia nativo en el campo vacío
        return; // Detiene por completo la ejecución si falta alguna sección por contestar
    }


    const veredicto = validateAdoptionRules(formValues, perroSeleccionadoActivo);

        if (veredicto.isValid) {
        // 1. Escondemos el formulario para limpiar la pantalla
        formularioAdoption.style.display = 'none';

        // 2. Inyectamos el veredicto de éxito en inglés y el botón de salida dinámico
        feedbackContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem; padding: 0.5rem 0;">
                <h3 style="margin-top: 0; font-size: 1.25rem; color: #16a34a;">Application Pre-Approved</h3>
                <p style="margin: 0 0 1.5rem 0; font-size: 0.95rem; color: #4b5563; line-height: 1.5;">
                    Thank you for your interest in adopting! We are currently reviewing your application, and you will receive an email shortly.
                </p>
                <button type="button" class="btn-active btn-regresar-dinamico" style="padding: 0.5rem 1rem; align-self: flex-start; cursor: pointer;">Return to Catalog</button>
            </div>
        `;
        
        // Mostramos el contenedor de feedback con el mensaje nuevo
        feedbackContainer.style.display = 'flex';

        // 3. Conectamos el botón dinámico para que limpie todo y regrese al catálogo
        feedbackContainer.querySelector('.btn-regresar-dinamico').addEventListener('click', () => {
            formularioAdoption.style.display = 'flex';
            feedbackContainer.style.display = 'none';
            formularioAdoption.reset();
            
            btnPerros.className = 'btn-active';
            btnInicio.className = 'btn-inactive';
            seccionPerros.className = 'section-visible';
            seccionInicio.className = 'section-hidden';
            document.getElementById('seccion-formulario').className = 'section-hidden';
        });

         // --- GUARDADO DE RESPALDO EN SUPABASE (Silencioso para el usuario) ---
        const datosSolicitud = {
            dog_id: perroSeleccionadoActivo.id,
            applicant_name: formValues.applicant_name,
            applicant_email: formValues.applicant_email,
            applicant_phone: formValues.applicant_phone,
            child_compatible: formValues.child_compatible,
            dog_compatible: formValues.dog_compatible,
            cat_compatible: formValues.cat_compatible,
            activity_level: formValues.activity_level,
            beginner_compatible: formValues.beginner_compatible,
            attitude_filter: formValues.attitude_filter,
            alone_time: formValues.alone_time,
            experience_text: formValues.experience_text,
            housing_text: formValues.housing_text,
            motivation_text: formValues.motivation_text
        };

        fetch(`${SUPABASE_URL}/rest/v1/adoption_applications`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(datosSolicitud)
        })
        .then(response => {
            if (!response.ok) throw new Error("Database insertion rejected");
            console.log("Backup successfully saved internally.");
        })
        .catch(error => {
            console.error("Internal log:", error);
            // Solo salta el alert si hay un fallo real de conexión o servidor
            alert("We are having technical difficulties. Please try again later. Sorry for the inconvenience.");
        });
        // --- FIN DEL BLOQUE ---

                // --- ADICIÓN: ENVÍO AUTOMATIZADO A MAKE.COM ---
        // Preparamos el payload unificado (Respuestas del Adoptante + Contexto del Perro)
        const payloadMake = {
            applicant: {
                name: formValues.applicant_name,
                email: formValues.applicant_email,
                phone: formValues.applicant_phone,
                answers: {
                    child_compatible: formValues.child_compatible,
                    dog_compatible: formValues.dog_compatible,
                    cat_compatible: formValues.cat_compatible,
                    activity_level: formValues.activity_level,
                    beginner_compatible: formValues.beginner_compatible,
                    attitude_filter: formValues.attitude_filter,
                    alone_time: formValues.alone_time
                },
                qualitative_texts: {
                    experience: formValues.experience_text,
                    housing: formValues.housing_text,
                    motivation: formValues.motivation_text
                }
            },
            // Enviamos el objeto literal del perro íntegro con todas sus columnas de Supabase
            dog: perroSeleccionadoActivo, 
            submitted_at: new Date().toISOString()
        };


        const URL_WEBHOOK_MAKE = 'https://hook.eu1.make.com/r5iwcn98x3xh21nsj60wnkew7jbw9lp6';

        fetch(URL_WEBHOOK_MAKE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadMake)
        })
        .then(response => {
            if (!response.ok) throw new Error("Webhook processing failed");
            console.log("Payload successfully delivered to Make!");
        })
        .catch(error => {
            console.error("External connection log:", error);
            // Si el webhook de Make se cae o falla, avisamos discretamente en inglés
            alert("We are having technical difficulties. Please try again later. Sorry for the inconvenience.");
        });
        // --- FIN DE LA ADICIÓN TO MAKE ---



    } else {

        formularioAdoption.style.display = 'none';
        const listaErroresHTML = veredicto.reasons.map(reason => `<li>${reason}</li>`).join('');
        
        feedbackContainer.innerHTML = `
            <h3 style="margin-top: 0; font-size: 1.15rem; color: #991b1b;">Application Verdict: Unsuccessful</h3>
            <p style="margin: 0.5rem 0 1rem 0; font-size: 0.95rem; color: #4b5563;">Based on your responses, we detected the following incompatibilities:</p>
            <ul style="padding-left: 1.25rem; margin: 0 0 1.5rem 0; font-size: 0.9rem; color: #1f2937; line-height: 1.5;">
                ${listaErroresHTML}
            </ul>
            <p style="font-weight: bold; margin: 0 0 1.5rem 0; color: #16a34a; font-size: 0.95rem;">
                We encourage you to look for another canine companion that fits your lifestyle!
            </p>
            <!-- Inyectamos el botón de retorno al catálogo -->
            <button type="button" class="btn-active btn-regresar-dinamico" style="padding: 0.5rem 1rem; cursor: pointer;">Return to Catalog</button>
        `;
        feedbackContainer.style.display = 'flex';

        // Escuchamos el clic en el botón recién creado para limpiar y volver
        feedbackContainer.querySelector('.btn-regresar-dinamico').addEventListener('click', () => {
            formularioAdoption.style.display = 'flex';
            feedbackContainer.style.display = 'none';
            formularioAdoption.reset();
            
            btnPerros.className = 'btn-active';
            btnInicio.className = 'btn-inactive';
            seccionPerros.className = 'section-visible';
            seccionInicio.className = 'section-hidden';
            document.getElementById('seccion-formulario').className = 'section-hidden';
        });
    }
});
// ==========================================
// Botón para probar la IA y no mi paciencia
// ==========================================
function injectDevTestingTools() {
    const devBtn = document.createElement('button');
    devBtn.innerText = '🧪 Auto-Fill Closed Fields (Pass Profile)';
    devBtn.style.position = 'fixed';
    devBtn.style.top = '50px';
    devBtn.style.right = '20px';
    devBtn.style.zIndex = '9999';
    devBtn.style.backgroundColor = '#1e293b';
    devBtn.style.color = '#ffffff';
    devBtn.style.border = 'none';
    devBtn.style.padding = '0.5rem 1rem';
    devBtn.style.borderRadius = '0.5rem';
    devBtn.style.cursor = 'pointer';
    devBtn.style.fontWeight = '600';
    devBtn.style.fontSize = '0.75rem';
    devBtn.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';

    devBtn.addEventListener('click', () => {
        // --- APPLICANT CONTACT INFO ---
        const inputName = document.getElementById('applicant-name');
        if (inputName) inputName.value = 'John Doe';

        const inputEmail = document.getElementById('applicant-email');
        if (inputEmail) inputEmail.value = 'john.doe.test@example.com';

        const inputPhone = document.getElementById('applicant-phone');
        if (inputPhone) inputPhone.value = '+34 600 000 000';

        // --- CLOSED AUTOMATION QUESTIONS ---
        // 1. Kids: No
        const selectChild = document.getElementById('child-compatible');
        if (selectChild) selectChild.value = 'false';

        // 2. Other dogs: No
        const selectDog = document.getElementById('dog-compatible');
        if (selectDog) selectDog.value = 'none';

        // 3. Cats/small animals: No
        const selectCat = document.getElementById('cat-compatible');
        if (selectCat) selectCat.value = 'false';

        // 4. Activity level: High or Very High
        const selectActivity = document.getElementById('activity-level');
        if (selectActivity) selectActivity.value = 'high';

        // 5. First experience: No (indica dueño experimentado)
        const selectBeginner = document.getElementById('beginner-compatible');
        if (selectBeginner) selectBeginner.value = 'false';

        // 6. Willing to undergo training: Yes, absolutely
        const selectAttitude = document.getElementById('attitude-filter');
        if (selectAttitude) selectAttitude.value = 'yes';

        // 7. Alone time: Less than 4 hours
        const selectAlone = document.getElementById('alone-time');
        if (selectAlone) selectAlone.value = 'short';

        console.log("✅ Contact info and 7 closed fields populated successfully.");
    });

    document.body.appendChild(devBtn);
}

// Ejecución controlada en entorno de desarrollo local
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    injectDevTestingTools();
}


