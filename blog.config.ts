import getAuthorContactHref, {
    ContactPlatformType,
} from "@utils/function/contact/getContactHref"

export interface UserPalleteType {
    primary1: string
    primary2: string
    primary3: string
    primary4: string
}
const userPallete: UserPalleteType = {
    primary1: "#F2E2CE",
    primary2: "#D9BD9C",
    primary3: "#A68A68",
    primary4: "#776350",
}

export interface AuthorInfoType {
    name: string
    currentGoal: string
    currentState: string
    contacts: {
        [key in ContactPlatformType]: string
    }
    logoImageUrl: string
    bannerImageUrl: string
    faviconUrl: string
}
const authorInfo: AuthorInfoType = {
    name: "danpacho",
    currentState: "Guide how to use blog easily",
    currentGoal: "great guideline suggestion",
    contacts: {
        email: getAuthorContactHref("email", "danpa725@cau.ac.kr"),
        github: getAuthorContactHref("github", "danpacho"),
        youtube: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
    },
    logoImageUrl: "/logo.webp",
    bannerImageUrl: "/banner.png",
    faviconUrl: "/favicon.png",
}

interface BlogInfoType {
    url: string
    siteName: string
    subtitle: string
    copyright: string
    language: string
    googleAnalyticsID?: string
}
const blogInfo: BlogInfoType = {
    url: "https://next-your-home-guide.vercel.app",
    siteName: "next your home",
    subtitle: "follw this guideline",
    copyright: `${
        authorInfo.name
    }© All rights reserved ${new Date().getFullYear()}.`,
    language: "ko",
    googleAnalyticsID: "G-RXF8YR06Z3",
}

const blogContentsDirectoryName = "blog" as const
interface ConfigType extends BlogInfoType {
    useTXT: boolean // description file format to .txt, not .json
    useKatex: boolean // katex option
    useMemo: boolean // improves dev speed, but require manual refresh except posts
    useMobileTOC: boolean // table of content on mobile
    userPallete: UserPalleteType // personal pallete
    blogContentsDirectoryName: `${typeof blogContentsDirectoryName}` // blog contents directory name
    author: AuthorInfoType
    postPerCategoryPage: number
    numberOfLatestPost: number
}
const config: ConfigType = {
    useTXT: false,
    useKatex: false,
    useMemo: false,
    useMobileTOC: true,
    userPallete,
    blogContentsDirectoryName,
    postPerCategoryPage: 4,
    numberOfLatestPost: 5,
    author: {
        ...authorInfo,
    },
    ...blogInfo,
}

export { config }
