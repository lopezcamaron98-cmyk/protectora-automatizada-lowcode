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

// Consulta directa usando FETCH nativo (Sin librerías)
async function fetchDogs() {
    try {
        contenedorPerros.innerHTML = '<p>Cargando perros desde la API...</p>';

        // Construimos la URL apuntando directamente a tu tabla 'dogs' con el orden deseado
        const urlAPI = `${SUPABASE_URL}/rest/v1/dogs?select=id,name,gender,size,status,photo_url,activity_level,medical_needs,birth_date,dog_compatible,cat_compatible,child_compatible,description&order=created_at.desc`;

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
                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                ageDisplay = age === 0 ? 'Puppy (< 1 year)' : age === 1 ? '1 year old' : `${age} years old`;
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
                            ${dog.description ? dog.description : 'No description available yet.'}
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
        });

    } catch (error) {
        console.error('Error en fetch:', error);
        contenedorPerros.innerHTML = `<p style="color: #b91c1c;">Error de conexión: ${error.message}</p>`;
    }
}
