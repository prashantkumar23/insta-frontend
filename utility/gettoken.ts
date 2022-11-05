import { GetServerSidePropsContext } from "next"
import { IToken } from "../interfaces"

export const getToken = ({ req }: GetServerSidePropsContext): IToken => {
    const token: IToken = {
        accesstoken: req.cookies['Authorization'],
        idtoken: req.cookies['Idtoken']
    }

    return token
}