export default function Error({ code, url = null }) {
    
    const message = {
        307: 'Page has temporarily been moved to',
        308: 'Page has permanently been moved to',
        400: 'Request cannot be filled due to bad syntax',
        401: 'Please sign in, then reattempt to access this page',
        402: 'Payment required',
        403: 'Access denied',
        404: 'Page not found',
        500: 'Internal server error'
    }
    return (

        <article>
            <h1>Error {code}</h1>
            <p>{message[code]}</p>
            <a>{url ?? ''}</a>
        </article>
    )
}