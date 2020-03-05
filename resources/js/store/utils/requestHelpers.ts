const errorMessage = 'Something went wrong. Please try again later or contact the support team';

export function handleError(error: any) {
    // Error code 422 means that the data validation fails.
    if (error.response.status !== 422) {
        console.error(error.resopnse.statusText);
        alert(errorMessage);
    }
    else {
        // Let the components provide feedback to final user.
        throw error;
    }
}
