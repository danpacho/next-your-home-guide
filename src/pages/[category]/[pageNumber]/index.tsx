import Link from "next/link"
import { GetStaticPaths, GetStaticProps } from "next"

import { ParsedUrlQuery } from "querystring"

import { PageType } from "@typing/page/type"
import { PostMetaType } from "@typing/post/meta"
import { CategoryInfoType } from "@typing/category/info"

import {
    getCategoryTotalPaginationNumber,
    getSpecificCategoryPagePostMeta,
    getAllCategoryPaginationPath,
    getCategoryPaginationTag,
} from "@utils/function/blog-contents-loader/contents/getCategoryPost"
import { getSpecificCategoryInfo } from "@utils/function/blog-contents-loader/contents/getCategory"

import { NextIcon, PrevIcon } from "@components/UI/Atoms/Icons"
import {
    CategoryCommonLayout,
    CategoryPaginationButton,
} from "@components/Blog/Category"

import { useAtoms, _slector } from "@lib/jotai"

import { config } from "blog.config"

interface ParamQuery extends ParsedUrlQuery {
    category: string
    pageNumber: string
}

export const getStaticProps: GetStaticProps<CategoryPostPerPageProps> = async ({
    params,
}) => {
    const { category, pageNumber } = params as ParamQuery

    const specificCategoryInfo = await getSpecificCategoryInfo({
        category,
        useTXT: config.useTXT,
    })

    const specificPageCategoryPostMeta = await getSpecificCategoryPagePostMeta({
        category,
        pageNumber: Number(pageNumber),
    })

    const spcificPageCategoryPostTagArray = getCategoryPaginationTag(
        specificPageCategoryPostMeta
    )

    const endPageNumber = await getCategoryTotalPaginationNumber(category)

    return {
        props: {
            categoryPostArray: specificPageCategoryPostMeta,
            categoryTagArray: spcificPageCategoryPostTagArray,
            isLast: Number(pageNumber) === endPageNumber,
            pageNumber,
            ...specificCategoryInfo,
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const specificPagePostContentPath = await getAllCategoryPaginationPath()

    return {
        paths: specificPagePostContentPath,
        fallback: false,
    }
}

interface CategoryPostPerPageProps extends CategoryInfoType {
    categoryPostArray: PostMetaType[]
    categoryTagArray: string[]
    pageNumber: string
    category: string
    isLast: boolean
}

function CategoryPostPerPage(props: CategoryPostPerPageProps) {
    const pageNumber = Number(props.pageNumber)

    const { isLast, categoryUrl, category } = props
    const isFirst = pageNumber === 1

    const { isLightState: isLight } = useAtoms(_slector("isLight"))

    return (
        <CategoryCommonLayout
            {...props}
            pageNumber={pageNumber}
            prevPageComponent={
                <Link
                    passHref
                    href={
                        isFirst
                            ? categoryUrl
                            : `${categoryUrl}/${pageNumber - 1}`
                    }
                >
                    <CategoryPaginationButton
                        type="button"
                        isLight={isLight}
                        isLeft
                    >
                        <PrevIcon width="1.15rem" height="1.15rem" />
                        {isFirst && `${category}`}
                        {!isFirst && `${pageNumber - 1} 페이지로`}
                    </CategoryPaginationButton>
                </Link>
            }
            nextPageComponent={
                <Link
                    href={
                        isLast
                            ? categoryUrl
                            : `${categoryUrl}/${pageNumber + 1}`
                    }
                    passHref
                >
                    <CategoryPaginationButton type="button" isLight={isLight}>
                        {isLast && isFirst && `텅💨 비었군요`}
                        {isLast && !isFirst && "마지막이에요! 축하드립니다🎉"}
                        {!isLast && `${pageNumber + 1} 페이지로`}
                        <NextIcon width="1.15rem" height="1.15rem" />
                    </CategoryPaginationButton>
                </Link>
            }
        />
    )
}
CategoryPostPerPage.displayName = "Category" as PageType

export default CategoryPostPerPage
