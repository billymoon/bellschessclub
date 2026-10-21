export const createClient = () => {
    return {
        createOrReplace: () => null,
        listen: () => {
            return {
                subscribe: () => ({
                    unsubscribe: () => {}
                })
            }
        }
    }
}
