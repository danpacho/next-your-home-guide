import styled, { css } from "styled-components"
import media, { MediaType, MEDIA_WIDTH } from "@styles/utils/media"

import Link from "next/link"

import { IsLight } from "@typing/theme"
import { PostMetaType } from "@typing/post/meta"

import { useWindowWidth } from "@hooks/index"

import { LayersAltIcon } from "@components/UI/Atoms/Icons"
import { SizedText } from "@components/UI/Atoms/SizedText"

import { useAtoms, _slector } from "@lib/jotai"

const PostMetaTagContainer = styled.ul`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    gap: 0.35rem;
`
const postMetaTagStyle = {
    category: () => css`
        border-radius: ${({ theme }) =>
            `${theme.bxxsm} ${theme.bxxsm} ${theme.bxxsm} ${theme.blg}`};
        ${media.widePhone} {
            border-radius: ${({ theme }) =>
                `${theme.bxxsm} ${theme.bxxsm} ${theme.bxxsm} ${theme.bsm}`};
        }
    `,
    update: () => css`
        border-radius: ${(p) => p.theme.bxxsm};
    `,
    author: () => css`
        border-radius: ${({ theme }) =>
            `${theme.bxxsm} ${theme.blg} ${theme.blg} ${theme.bxxsm}`};
        ${media.widePhone} {
            border-radius: ${({ theme }) =>
                `${theme.bxxsm} ${theme.bsm} ${theme.bsm} ${theme.bxxsm}`};
        }
    `,
}

interface PostMetaTagStyle {
    type: keyof Omit<PostMetaProps, "color" | "tags" | "isCategoryPage">
    color: string
}
const PostMetaTag = styled.li<PostMetaTagStyle & IsLight>`
    transition: background-color 0.25s ease-out;

    display: flex;
    align-items: center;
    justify-content: center;

    max-width: 7.5rem;
    height: 1.15rem;

    padding: 0.15rem 0.5rem;

    background-color: ${({ color, isLight, theme }) =>
        isLight ? color : `${color}${theme.opacity60}`};

    color: ${(p) => p.theme.white};
    font-size: ${(p) => p.theme.sm};
    font-weight: 300;

    &:hover {
        background-color: ${({ color, isLight, theme }) =>
            isLight ? `${color}${theme.opacity60}` : color};
    }

    ${({ type }) => postMetaTagStyle[type]}

    ${media.mediumTablet} {
        max-width: 6.5rem;
        padding: 0.2rem 0.4rem;

        font-size: ${(p) => p.theme.xsm};
    }

    ${media.widePhone} {
        max-width: 8rem;

        padding: 0.15rem 0.25rem;

        font-size: ${(p) => p.theme.xsm};
        font-weight: 400;
    }

    ${media.mediumPhone} {
        max-width: 4rem;
    }
`

interface PostMetaProps
    extends Pick<
        PostMetaType,
        "category" | "author" | "update" | "color" | "tags"
    > {
    isCategoryPage?: boolean
}

const TAG_NUMBER = {
    min: 2,
    max: 3,
}

function PostMeta({
    author,
    category,
    update,
    color,
    tags,
    isCategoryPage,
}: PostMetaProps) {
    const { isLightState: isLight } = useAtoms(_slector("isLight"))
    const { mediaWidth } = useWindowWidth()

    const isContentSizeSmall =
        mediaWidth !== "smallScreen" &&
        mediaWidth !== "mediumScreen" &&
        mediaWidth !== "wideScreen"
    const renderTagNumber = isContentSizeSmall ? TAG_NUMBER.min : TAG_NUMBER.max

    return (
        <PostMetaTagContainer>
            {isCategoryPage &&
                tags
                    .slice(0, renderTagNumber)
                    .map((tag, order) => (
                        <PostMetaTagChild
                            tag={tag}
                            color={color}
                            isFirst={order === 0}
                            isLast={order === renderTagNumber - 1}
                            isLight={isLight}
                            key={tag}
                        />
                    ))}

            {!isCategoryPage && (
                <Link href={`/${category}`} passHref>
                    <PostMetaTag
                        type="category"
                        color={color}
                        isLight={isLight}
                    >
                        <SizedText
                            defaultLineNumber={1}
                            breakOption="break-all"
                        >
                            {category}
                        </SizedText>
                    </PostMetaTag>
                </Link>
            )}
            {!isCategoryPage && (
                <PostMetaTag type="update" color={color} isLight={isLight}>
                    <SizedText defaultLineNumber={1}>{update}</SizedText>
                </PostMetaTag>
            )}
            <Link href="/profile" passHref>
                <PostMetaTag type="author" color={color} isLight={isLight}>
                    <SizedText defaultLineNumber={1} breakOption="break-all">
                        {author}
                    </SizedText>
                </PostMetaTag>
            </Link>
        </PostMetaTagContainer>
    )
}

interface PostMetaTagChildProps extends IsLight {
    tag: string
    color: string
    isFirst: boolean
    isLast: boolean
}
const PostMetaTagChild = ({
    tag,
    color,
    isFirst,
    isLast,
    isLight,
}: PostMetaTagChildProps) => {
    return (
        <PostMetaTag
            type={isFirst ? "category" : "update"}
            color={color}
            isLight={isLight}
        >
            <SizedText defaultLineNumber={1} breakOption="break-all">
                {`#${tag}`}
                {isLast && (
                    <LayersAltIcon fill={"white"} width="12px" height="12px" />
                )}
            </SizedText>
        </PostMetaTag>
    )
}

export default PostMeta
