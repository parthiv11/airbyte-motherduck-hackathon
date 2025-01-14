// This function fetches a MotherDuck token for the frontend to use to connect to MotherDuck.
// read_scaling: true fetches a new read-scaling token with a set expiration time.
export async function fetchMotherDuckToken(read_scaling: boolean = true): Promise<string> {
    // const response = await fetch(`/api/md-token?read_scaling=${read_scaling}`)
    // const { mdToken } = await response.json()
    // return mdToken
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0uYS5yaW9zLmdsLmFkLmVAZ29vZ2xlbWFpbC5jb20iLCJzZXNzaW9uIjoibS5hLnJpb3MuZ2wuYWQuZS5nb29nbGVtYWlsLmNvbSIsInBhdCI6IkJLSGdtUnkwNzdORE9GZFBycTNrbjhRYWZGTnMxcmlHcFotNXozMU4xbWciLCJ1c2VySWQiOiJjNzdhZDkwNy03MDg1LTRmYmEtODVhMy1hZGZjMjZjYzJjZmUiLCJpc3MiOiJtZF9wYXQiLCJyZWFkT25seSI6dHJ1ZSwidG9rZW5UeXBlIjoicmVhZF9zY2FsaW5nIiwiaWF0IjoxNzM2NzA2NDAxfQ.8_HhSNz9bTZ6-EwnqrARmwCysd_ldkWnQRN7fVKjsIM"
}