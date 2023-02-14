export class TimeOutError extends Error {
    constructor() {
        super('Prompt timed out.');

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TimeOutError);
        }

        this.name = 'TimeOutError';
    }
}

export class CancelError extends Error {
    constructor() {
        super('Prompt was canceled by user.');

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CancelError);
        }

        this.name = 'CancelError';
    }
}
