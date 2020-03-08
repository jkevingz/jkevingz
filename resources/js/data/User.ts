export class User {
    
    /**
     * Unique identifier of the user. This is 0 when the user is 'new'
     */
    id: number = 0;

    /**
     * The name of the user.
     */
    name: string;

    /**
     * The email this user logs in with.
     */
    email: string;

    /**
     * User's constructor.
     * 
     * @param name The name of the user.
     * @param email The email this user logs in with.
     * @param id Unique identifier of the user. This is null when the user is 
     *  'new'.
     */
    constructor(name?: string, email?: string, id?: number) {
        this.id = id || 0;
        this.name = name || '';
        this.email = email || '';;
    }

    /**
     * Detemine if the user is new depending on the id of the user.
     */
    isNew(): boolean {
        return this.id === 0;
    }

    /**
     * Whether this user is the same as the given user.
     * 
     * @param user The user to compare.
     */
    isEqualToUser(user: User): boolean {
        return this.id === user.id;
    }

    /**
     * Whether this user is not the same as the given one.
     * 
     * @param user The user to compare.
     */
    isNotEqualToUser(user: User): boolean {
        return !this.isEqualToUser(user);
    }

    /**
     * Helper method to return an array of users with the given response data.
     * 
     * @param data The data array containing the user information.
     */
    static createMultipleFromResponse(data: User[]) {
        return data.map(item => this.createSingleFromResponse(item));
    }

    /**
     * Helper method to return a user object with the given response data.
     * 
     * @param data The data object containing the user information.
     */
    static createSingleFromResponse(data: User) {
        return new User(data.name, data.email, data.id);
    }
}
