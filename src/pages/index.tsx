import { DeleteIcon, SmallLogoIcon, MenuIcon, BgIcon } from "@/assets/icons";
import { ContentQuiz, SidebarButton, UserInfor } from "@/components";
import { uppercaseLetters } from "@/constants";
import { authSelector } from "@/redux/reducers";
import { ModelApi } from "@/services";
import { IContent, IConversation } from "@/types";
import { Avatar, Button, Dropdown, Input, List, Skeleton, Select } from "antd";
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
  const [refType, setRefType] = useState<string>("L");

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
            refType: refType,
          },
        ]);
        let res: any;
        if (loggedin) {
          res = await ModelApi.getAnswerByUser({
            answers: newArr,
            question: question.trim(),
            conversationId: conversationId,
            version: version,
            refType: refType,
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
            refType: refType,
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
  }, [answers, question, currentConversation, contents, version, refType]);

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
      {/* <div
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
      </div> */}
      <div className="flex relative h-full max-w-full flex-1 flex-col overflow-hidden self-end z-1">
        <div className="sticky top-0 z-10 flex min-h-[40px] items-center border-b border-gray-700 p-[10px] bg-gray-900">
          {/* <div
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
          </div> */}
          <span className="text-lg font-sans font-medium text-white cursor-pointer">
            {/* HistoryQuiz */}
            HISTORYQUIZ
          </span>

          <div className="flex-1 flex justify-center relative">
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
                        className="h-[30px] flex flex-row items-center w-[120px]"
                      >
                        <span className="ml-3 text-base font-sans">QWEN</span>
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
                        style={{ opacity: 0.5, pointerEvents: "none" }}
                        className="h-[30px] flex flex-row items-center"
                      >
                        <span className="ml-3 text-base font-sans">BLOOMZ</span>
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
                        style={{ opacity: 0.5, pointerEvents: "none" }}
                        className="h-[30px] flex flex-row items-center"
                      >
                        <span className="ml-3 text-base font-sans">LLAMA</span>
                      </div>
                    ),
                  },
                ],
              }}
              placement="bottomCenter"
              dropdownRender={(menu) => (
                <div className="bg-white rounded-md shadow-lg w-[120px]">
                  {menu}
                </div>
              )}
              align={{ offset: [0, 0] }}
            >
              <span className="mr-12 text-xl font-sans font-medium text-white p-3 cursor-pointer w-[120px] text-center">
                {title}
              </span>
            </Dropdown>
          </div>
          <div className="ml-auto">
            <Button
              type="default"
              className="px-5 font-sans"
              onClick={() => router.push("/graph")}
            >
              Graph
            </Button>
          </div>
        </div>
        <div
          className="overflow-y-auto h-full w-full flex-1 overflow-hidden items-center flex flex-col bg-cover bg-center h-screen"
          ref={messageContainerRef}
          style={{ backgroundImage: `url(${BgIcon.src})` }}
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
                  Knowledge Graph System
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
                    // suffix={
                    //   <div
                    //     className="cursor-pointer"
                    //     onClick={() => {
                    //       deleteAnswers(index);
                    //     }}
                    //   >
                    //     <Image src={DeleteIcon} alt="Submit" width={20} />
                    //   </div>
                    // }
                  />
                </div>
              ))}
            </div>
            <div className="w-full flex flex-row justify-end gap-5">
              <Select
                className="w-[40%] max-w-[200px] min-h-[48px]"
                value={refType}
                options={[
                  { value: "Q", label: "Reference by QWEN" },
                  { value: "L", label: "Reference by LLAMA" },
                ]}
                onChange={(value: any) => {
                  setRefType(value);
                }}
              />
              <Button
                className="!bg-gray-700 min-h-[48px] rounded-[12px] w-[40%] max-w-[200px] !important-[&:hover]:bg-gray-300 !important-[&:focus]:bg-gray-300 !important-[&:active]:bg-gray-300"
                type="default"
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
