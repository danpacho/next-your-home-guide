import { useCallback, useEffect, useState } from "react"

import useWindowTheme from "@hooks/useWindowTheme"

type GameOptionType = "rock" | "scissors" | "paper"
type GameEmojiType = "👊" | "✌️" | "🖐"
type GameResultType = "win" | "lose" | "draw"

interface Game {
    emoji: GameEmojiType
    name: GameOptionType
    win: GameOptionType
}

const GAME_CONSTANT: Readonly<Game[]> = [
    { emoji: "👊", name: "rock", win: "scissors" },
    { emoji: "✌️", name: "scissors", win: "paper" },
    { emoji: "🖐", name: "paper", win: "rock" },
] as const
const GAME_CHOICE_NUMBER = GAME_CONSTANT.length
const GAME_RESULT_HANDLER = (
    user: GameOptionType,
    robot: GameOptionType
): GameResultType => {
    if (user === robot) return "draw"

    const gameConstant = GAME_CONSTANT.find(({ name }) => name === user)
    if (gameConstant === undefined) throw Error("Invalid Input")
    if (gameConstant.win === robot) return "win"

    return "lose"
}

const sleep = (ms: number = 1500, func?: (...args: any[]) => any) =>
    new Promise((res, _) => setTimeout(func ?? res, ms))

const numBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min

type ClassNameType = "font" | "box" | "btn"
const C = (isLight: boolean, classNameList: ClassNameType[] | ClassNameType) =>
    Array.isArray(classNameList)
        ? `${classNameList.reduce(
              (acc, className) =>
                  `${acc} ${className} ${className}-${
                      isLight ? "light" : "dark"
                  }`,
              ""
          )}`
        : `${classNameList} ${classNameList}-${isLight ? "light" : "dark"}`

const StyleSheet = () => (
    <>
        <style jsx>{`
            .header {
                width: 80%;
                font-size: 1.5rem;
                font-weight: 700;
                text-align: center;
            }
            .container {
                position: relative;
                width: 100%;
                height: fit-content;
                min-height: 20rem;

                flex-direction: column;
                border-radius: 10px;
                box-shadow: 0 0 1px 0 gray;
            }
            .slect_container {
                display: flex;
                align-items: center;
                justify-content: space-around;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .game_result {
                font-size: 1.25rem;
                font-weight: 500;
            }

            .game_container {
                padding: 1.5rem;
            }
            .game_emoji {
                width: fit-content;
                height: fit-content;
                font-size: 1.5rem;
            }
            .game_name {
                font-size: 1.1rem;
                font-weight: 700;
            }

            @keyframes loading {
                0% {
                    transform: scale(0.5) rotate(0deg);
                }
                50% {
                    transform: scale(1.25) rotate(360deg);
                }
                100% {
                    transform: scale(0.75) rotate(0deg);
                }
            }
            .game_load {
                font-size: 2rem;

                padding: 1rem;

                border: 0.25rem solid moccasin;
                border-radius: 50%;

                background-image: linear-gradient(
                    120deg,
                    #f6d365 0%,
                    #fda085 100%
                );

                animation: loading 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)
                    infinite;
            }
            .theme_btn {
                position: absolute;
                top: 1rem;
                right: 1rem;
            }
        `}</style>

        <style jsx>{`
            .box {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1.25rem;

                padding: 0.25rem;

                border-radius: 1.5px;
            }
            .box-dark {
                background-color: #171717;
            }
            .box-light {
                background-color: #ffffff;
            }
            .btn {
                display: flex;
                align-items: center;
                justify-content: center;

                gap: 0.25rem;

                border-radius: 2.5px;
                padding: 0.35rem 0.75rem;
                cursor: pointer;
            }
            .btn-dark {
                background-color: #303030;
            }
            .btn-dark:hover {
                background-color: #121212;
            }
            .btn-light {
                background-color: #f6f6f6;
            }
            .btn-light:hover {
                background-color: #e9e9e9;
            }
            .font {
                font-size: 1rem;
                font-weight: 500;
            }
            .font-light {
                color: black;
            }
            .font-dark {
                color: whitesmoke;
            }
        `}</style>
    </>
)

function Game() {
    const windowTheme = useWindowTheme()
    const [isLight, setIsLight] = useState(windowTheme === "light")
    useEffect(() => {
        setIsLight(windowTheme === "light")
    }, [windowTheme])

    const [isRobotChoosing, setIsRobotChoosing] = useState(false)

    const [userChoice, setUserChoice] = useState<GameOptionType | "init">(
        "init"
    )
    const [robotChoice, setRobotChoice] = useState<GameOptionType | "init">(
        "init"
    )

    const [gameResult, setGameResult] = useState<GameResultType | "init">(
        "init"
    )
    const isGameStarted = gameResult !== "init"

    const [loadNumber, setLoadNumber] = useState(0)

    const getRobotChoice = useCallback(async () => {
        setIsRobotChoosing(true)

        await sleep(2500)

        setIsRobotChoosing(false)
        setRobotChoice(
            GAME_CONSTANT[numBetween(0, GAME_CHOICE_NUMBER - 1)].name
        )
    }, [])

    useEffect(() => {
        if (userChoice !== "init" && robotChoice !== "init")
            setGameResult(GAME_RESULT_HANDLER(userChoice, robotChoice))
    }, [userChoice, robotChoice])

    useEffect(() => {
        let timer: NodeJS.Timer
        if (isRobotChoosing === false) {
            setLoadNumber(0)
            return
        }

        timer = setInterval(() => {
            setLoadNumber((num) => num + 1)
        }, 200)

        return () => clearInterval(timer)
    }, [isRobotChoosing, loadNumber])

    return (
        <div className={`${C(isLight, ["box", "font"])} container`}>
            <header className={`header`}>
                {!isGameStarted && !isRobotChoosing && (
                    <p>Rock Scissors Paper!</p>
                )}
                {isGameStarted && !isRobotChoosing && (
                    <p>
                        {gameResult === "draw" && "Draw... Pretty good"}
                        {gameResult === "lose" && "Easy peasy humans... Retry?"}
                        {gameResult === "win" &&
                            "It is Impossible. Fight again!"}
                    </p>
                )}
                {isRobotChoosing && "Are you nervous?"}
            </header>
            {isGameStarted && !isRobotChoosing && (
                <div className={`${C(isLight, "btn")} game_result`}>
                    {
                        GAME_CONSTANT.find(({ name }) => name === userChoice)
                            ?.emoji
                    }{" "}
                    vs{" "}
                    {
                        GAME_CONSTANT.find(({ name }) => name === robotChoice)
                            ?.emoji
                    }
                </div>
            )}

            {isRobotChoosing && (
                <>
                    <div className={`game_load`}>
                        {GAME_CONSTANT[loadNumber % 3].emoji}
                    </div>
                    <span className="game_result">You choose {userChoice}</span>
                    <span className="game_result">Robot choose...</span>
                </>
            )}

            {!isRobotChoosing && (
                <div className={`${C(isLight, "box")} slect_container`}>
                    {GAME_CONSTANT.map(({ emoji, name }) => (
                        <button
                            onClick={() => {
                                getRobotChoice()
                                setUserChoice(name)
                            }}
                            className={`${C(isLight, [
                                "btn",
                                "font",
                            ])} game_container`}
                            type="button"
                            key={name}
                        >
                            <div className="game_emoji">{emoji}</div>
                            <span className="game_name">{name}</span>
                        </button>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsLight((isLight) => !isLight)}
                className={`theme_btn ${C(isLight, ["btn", "font"])}`}
            >
                {isLight ? "🌞" : "🌚"}
            </button>

            <StyleSheet />
        </div>
    )
}

export default Game
