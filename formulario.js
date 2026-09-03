/**
 * Motor de validación de negocio para el filtro duro de adopción.
 * Compara las respuestas del formulario con los ENUM reales de Supabase.
 */
export function validateAdoptionRules(formData, dogMetadata) {
    const rejectionReasons = [];

    // 1. Niños (child_compatible es compatibility_tri_state: 'Yes', 'No', 'Unknown')
    if (dogMetadata.child_compatible === 'No' && formData.child_compatible === 'true') {
        rejectionReasons.push("This dog is not compatible with homes where children live or visit often.");
    }

    // 2. Otros perros (dog_compatible es dog_compatibility_options: 'Yes', 'No', 'Only Females', 'Only Males', 'Selective')
    // El usuario seleccionó en el select: 'none', 'male', 'female', 'multiple'
    if (formData.dog_compatible !== 'none') {
        if (dogMetadata.dog_compatible === 'No') {
            rejectionReasons.push("This dog needs to be the only dog in the house.");
        } else if (dogMetadata.dog_compatible === 'Only Females' && (formData.dog_compatible === 'male' || formData.dog_compatible === 'multiple')) {
            rejectionReasons.push("This dog can only live with female dogs.");
        } else if (dogMetadata.dog_compatible === 'Only Males' && (formData.dog_compatible === 'female' || formData.dog_compatible === 'multiple')) {
            rejectionReasons.push("This dog can only live with male dogs.");
        }
        // Nota: Si es 'Selective', se delega a la evaluación cualitativa en Make
    }

    // 3. Gatos (cat_compatible es compatibility_tri_state: 'Yes', 'No', 'Unknown')
    if (dogMetadata.cat_compatible === 'No' && formData.cat_compatible === 'true') {
        rejectionReasons.push("This dog doesn't get along with cats or other small animals.");
    }

    // 4. Actividad física (activity_level es activity_level_options: 'Low', 'Medium', 'High', 'Very High')
    // Si el perro es High/Very High pero el usuario tiene perfil Low
    if ((dogMetadata.activity_level === 'High' || dogMetadata.activity_level === 'Very High') && formData.activity_level === 'low') {
        rejectionReasons.push("This dog has a lot of energy and needs more daily exercise than you can offer.");
    }

    // 5. Principiantes (beginer_compatible es compatibility_tri_state: 'Yes', 'No', 'Unknown')
    if (dogMetadata.beginer_compatible === 'No' && formData.beginner_compatible === 'true') {
        rejectionReasons.push("This dog requires someone with previous experience and advanced handling.");
    }

    // 6. Actitud/Formación (Pregunta del formulario)
    if (formData.attitude_filter === 'no') {
        rejectionReasons.push("Adopting a dog requires a commitment to follow professional training if necessary.");
    }

    return {
        isValid: rejectionReasons.length === 0,
        reasons: rejectionReasons
    };
}
