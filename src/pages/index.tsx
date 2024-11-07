import { DeleteIcon, SmallLogoIcon, MenuIcon } from "@/assets/icons";
import { ContentQuiz, SidebarButton, UserInfor } from "@/components";
import { uppercaseLetters } from "@/constants";
import { authSelector } from "@/redux/reducers";
import { ModelApi } from "@/services";
import { IContent, IConversation } from "@/types";
import { Avatar, Button, Dropdown, Input, List, Skeleton } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Page = () => {
  const router = useRouter();
  const messageContainerRef = useRef<any>(null);
  const { user, loggedin } = useSelector(authSelector);

  const [show, setShow] = useState(false);
  const [question, setQuestions] = useState("");
  const [data, setData] = useState<IConversation[]>([]);
  const [contents, setContents] = useState<IContent[]>([]);
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = useState(1);

  const [currentConversation, setCurrentConversation] =
    useState<IConversation>();

  useEffect(() => {
    if (user && user.role === 2) {
      router.push("/admin");
    }
  }, []);

  const handleGetHistory = useCallback(async () => {
    try {
      const res = await ModelApi.getConversationUser();
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    handleGetHistory();
  }, []);

  useEffect(() => {
    if (!loggedin) {
      setCurrentConversation(undefined);
      setData([]);
      setContents([]);
    }
  }, [loggedin]);

  const handleClickConversation = useCallback(async (data: IConversation) => {
    try {
      setIsLoading(true);
      setContents([]);
      setCurrentConversation(data);
      const res = await ModelApi.getConversationContent(data._id);
      setContents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(() => {
    router.push("/login");
  }, []);

  const addNewAnswers = useCallback(() => {
    if (answers.length === 4) {
      toast.error("You only can type 4 answers per question!");
    } else {
      setAnswers([...answers, ""]);
    }
  }, [answers]);

  const deleteAnswers = useCallback(
    (index: number) => {
      if (answers.length === 2) {
        toast.error("Question should have as least 2 answers!");
      } else {
        setAnswers(
          answers.filter((value, i) => {
            return i !== index;
          })
        );
      }
    },
    [answers]
  );

  const handleGetAnswer = useCallback(async () => {
    try {
      if (question === "" || answers.includes("")) {
        toast.error("Please complete all information!");
      } else {
        setLoading(true);
        const conversationId = currentConversation?._id || "";
        const newArr = answers.map((ans, index) => {
          return `${uppercaseLetters[index]}. ${ans.trim()}`;
        });
        setContents((contents) => [
          ...contents,
          {
            _id: "",
            answers: newArr,
            conversationId: conversationId,
            correct_answer: "",
            createdAt: "",
            explanation: "",
            question: question,
            type: "ask",
            updatedAt: "Wed, 17 Apr 2024 08:46:54 GMT",
            top_k: [],
            version: version,
          },
        ]);
        let res: any;
        if (loggedin) {
          res = await ModelApi.getAnswerByUser({
            answers: newArr,
            question: question.trim(),
            conversationId: conversationId,
            version: version,
          });
          if (!currentConversation) {
            try {
              const conversations = await ModelApi.getConversationUser();
              setData(conversations.data);
              setCurrentConversation(
                conversations.data.filter(
                  (e) => e._id === res.data.conversation_id
                )[0]
              );
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          res = await ModelApi.getAnswerByCustomer({
            answers: newArr,
            question: question.trim(),
            conversationId: conversationId,
            version: version,
          });
        }
        setQuestions("");
        setAnswers(["", "", "", ""]);
        setContents((contents) => [
          ...contents,
          {
            _id: res.data?.answer_id || "",
            answers: newArr,
            conversationId: conversationId,
            correct_answer: res.data.correct_answer,
            createdAt: "",
            explanation: res.data.explanation,
            question: question,
            type: "answer",
            updatedAt: "Wed, 17 Apr 2024 08:46:54 GMT",
            version: version,
            top_k: res.data.top_k,
          },
        ]);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "There are some problem");
      setContents((contents) => {
        const newContents = contents.slice(0, -1);
        return newContents;
      });
    } finally {
      setLoading(false);
    }
  }, [answers, question, currentConversation, contents, version]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [contents]);

  const handleAddNewChat = useCallback(() => {
    setCurrentConversation(undefined);
    setContents([]);
  }, []);

  const title = useMemo(() => {
    switch (version) {
      case 1:
        return "QWEN";
      case 2:
        return "BLOOMZ";
      case 3:
        return "LLAMA";

      default:
        return "";
    }
  }, [version]);

  return (
    <div className="bg-white relative z-0 flex h-screen w-full overflow-hidden">
      <div
        className="relative z-20 w-[80px] h-full flex-shrink-0 overflow-x-hidden bg-[#001529]"
        style={{ backdropFilter: "none" }}
      >
        <div className="bg-[#001529] h-full flex flex-col">
          <Button
            type="primary"
            className="mx-4 my-4 text-white"
            onClick={() => router.push("/graph")}
          >
            Graph
          </Button>
        </div>
      </div>
      <div className="flex relative h-full max-w-full flex-1 flex-col overflow-hidden self-end z-1">
        <div className="sticky top-0 z-10 flex min-h-[40px] items-center border-b border-gray-700 p-[10px] bg-gray-900">
          <div
            className="p-[10px] block sm:hidden z-10"
            onClick={() => {
              setShow(true);
            }}
          >
            <Image
              src={MenuIcon}
              alt="Logo"
              className="w-[15px] h-[15px] invert"
            />
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <div
                      onClick={() => {
                        setVersion(1);
                      }}
                      className="h-[30px] flex flex-row items-center bg-gray-800 hover:bg-gray-700"
                    >
                      <span className="ml-3 text-base font-sans text-white">
                        QWEN
                      </span>
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <div
                      onClick={() => {
                        setVersion(2);
                      }}
                      className="h-[30px] flex flex-row items-center bg-gray-800 hover:bg-gray-700"
                    >
                      <span className="ml-3 text-base font-sans text-white">
                        BLOOMZ
                      </span>
                    </div>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <div
                      onClick={() => {
                        setVersion(3);
                      }}
                      className="h-[30px] flex flex-row items-center bg-gray-800 hover:bg-gray-700"
                    >
                      <span className="ml-3 text-base font-sans text-white">
                        LLAMA
                      </span>
                    </div>
                  ),
                },
              ],
            }}
          >
            <span className="text-2xl font-sans font-medium text-white p-3 cursor-pointer">
              HistoryQuiz {title}
            </span>
          </Dropdown>
        </div>
        <div
          className="overflow-y-auto h-full w-full flex-1 overflow-hidden items-center flex flex-col"
          ref={messageContainerRef}
          onClick={() => {
            setShow(false);
          }}
        >
          <div className="flex flex-col pb-[30px] max-w-[800px] w-[90%]">
            {contents.map((e) => (
              <ContentQuiz data={e} key={e._id} />
            ))}
            {(isLoading || loading) && (
              <div className="px-[20px] py-[30px]">
                <Skeleton active avatar />
              </div>
            )}
            {!currentConversation && contents.length === 0 && (
              <div className="w-full items-center flex flex-col pt-[100px] gap-[20px]">
                <div className="rounded-full w-[70px] h-[70px] bg-gray-200 border border-gray-200 flex items-center justify-center">
                  <Image
                    src={SmallLogoIcon}
                    alt="Logo"
                    className="w-[35px] h-[35px]"
                  />
                </div>
                <span className="text-3xl text-black font-medium font-sans">
                  Knowledge graph system
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="py-6 px-[20px] bg-gray-100 justify-center flex">
          <div className="gap-[15px] flex flex-col max-w-[900px] w-full">
            <Input
              className="min-h-[40px] text-base text-black rounded-[12px] border-gray-400"
              placeholder="Question"
              value={question}
              onChange={(event) => {
                setQuestions(event.target.value);
              }}
              tabIndex={0}
            />
            <div
              className="flex flex-row gap-y-5 justify-between flex-wrap max-h-[140px] overflow-y-auto bar"
              style={{
                scrollbarWidth: "none",
              }}
            >
              {answers.map((ans, index) => (
                <div
                  className="w-[90%] sm:w-[47%] flex flex-row items-center"
                  key={index}
                >
                  <span className="text-black text-2xl mr-3">
                    {uppercaseLetters[index]}.
                  </span>
                  <Input
                    className="min-h-[40px] text-base text-black rounded-[12px] border-gray-400 w-full"
                    placeholder={`Input answer ${uppercaseLetters[index]}`}
                    value={ans}
                    tabIndex={index + 1}
                    onChange={(event) => {
                      setAnswers(
                        answers.map((text, i) => {
                          if (i === index) {
                            return event.target.value;
                          } else {
                            return text;
                          }
                        })
                      );
                    }}
                    suffix={
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          deleteAnswers(index);
                        }}
                      >
                        <Image src={DeleteIcon} alt="Submit" width={20} />
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
            <div className="w-full flex flex-row justify-end gap-5">
              <div
                className="w-[40%] max-w-[200px] min-h-[48px] text-black border border-gray-600 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:border-blue-400 hover:text-blue-400"
                onClick={addNewAnswers}
              >
                <span className="font-sans text-base font-medium">Add</span>
              </div>
              <Button
                className="min-h-[48px] rounded-[12px] w-[40%] max-w-[200px]"
                type="primary"
                loading={loading}
                disabled={loading}
                onClick={handleGetAnswer}
              >
                <span className="font-sans text-base text-white font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
