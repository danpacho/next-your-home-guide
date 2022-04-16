import { FontSizeType } from "@/styles/utils/font"
import media from "@/styles/utils/media"
import { PalleteType } from "@/styles/utils/pallete"
import styled, { css } from "styled-components"
interface UnderscoreTextStyle {
    isHover: boolean

    underscoreColor: string
    underscoreHeight?: number
    underscoreMargin?: number
    underscoreOpacity?: number

    fontSize: FontSizeType
    fontColor?: PalleteType
    fontWeight: number

    transformOrigin?: "center" | "right" | "left"
}

const UnderscoreTextStyled = styled.div<UnderscoreTextStyle>`
    font-size: ${({ theme, fontSize }) => theme[fontSize]};
    color: ${({ theme, fontColor }) =>
        fontColor ? theme[fontColor] : theme.headerFontColor};
    font-weight: ${({ fontWeight }) => fontWeight};

    ::after {
        transition: transform 0.25s ease-in-out;

        content: "";
        display: block;

        background-color: ${({ underscoreColor }) => underscoreColor};
        opacity: ${({ underscoreOpacity, theme }) =>
            underscoreOpacity ? underscoreOpacity : theme.themeOpacity};

        margin-top: -0.35rem;
        height: 0.5rem;

        transform-origin: ${({ transformOrigin }) =>
            transformOrigin ? transformOrigin : "center"};
        transform: scaleX(0);
    }

    ${({ isHover }) =>
        isHover &&
        css`
            ::after {
                transform: scaleX(1);
            }
        `}

    ${media.mediumTablet} {
        font-size: ${(p) => p.theme.md};
        ::after {
            display: none;
        }
    }

    ${media.widePhone} {
        font-weight: 300;
    }
`

interface UnderscoreTextProps extends UnderscoreTextStyle {
    children: string
}
function UnderscoreText(props: UnderscoreTextProps) {
    return (
        <UnderscoreTextStyled {...props}>{props.children}</UnderscoreTextStyled>
    )
}

export default UnderscoreText
