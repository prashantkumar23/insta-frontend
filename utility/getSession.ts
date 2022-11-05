import { CognitoUserPool } from 'amazon-cognito-identity-js';

const PoolConfig = {
    UserPoolId: "us-west-2_N00OdRUGa",
    ClientId: "6gfuha3jj4tkq9jn38ml3s0ecp"
}

export const Pool = new CognitoUserPool(PoolConfig)

const getSession = async () =>{
    return new Promise((resolve, reject) => {
        const user = Pool.getCurrentUser();
        
        if (user) {
            user.getSession(async (err: Error, session: any) => {
                if (err) {
                    reject(err);
                } else {
                    const attributes: any = await new Promise((resolve, reject) => {
                        user.getUserAttributes((err: Error | undefined, attributes: any) => {
                            if (err) {
                                reject(err);
                            } else {

                                const results = {};

                                for (let attribute of attributes) {
                                    const { Name, Value } = attribute;
                                    //@ts-ignore
                                    results[Name] = Value;
                                }
                                console.log('attributes:', results);
                                resolve(results);
                            }
                        });
                    });

                    const accessToken = session.accessToken.jwtToken;


                    const token = session.getIdToken().getJwtToken();

                    resolve({
                        user,
                        accessToken,
                        headers: {
                            'x-api-key': attributes['custom:apikey'],
                            Authorization: token,
                        },
                        ...session,
                        ...attributes,
                    });
                }
            });
        } else {
            reject("User is not found");
        }
    });
}

// getSession().then((res) => console.log("res", res)).catch((err) =>  console.log(err))
const GetSession = async () => {
    const data = await getSession()
    return data
}

export default GetSession