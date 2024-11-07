import React, { FC, useCallback, useMemo, useState } from "react";
import { ContentQuizProps } from "./ContentQuiz.types";
import Image from "next/image";
import { DefaultAvatarIcon, DisLikeIcon, SmallLogoIcon } from "@/assets/icons";
import { useSelector } from "react-redux";
import { authSelector } from "@/redux/reducers";
import toast from "react-hot-toast";
import { ModelApi } from "@/services";

const ContentQuiz: FC<ContentQuizProps> = ({ data }) => {
  const { loggedin, user } = useSelector(authSelector);
  const [show, setShow] = useState(false);
  const [bad, setBad] = useState(false);

  const feedbackList = useMemo(() => {
    return [
      "Wrong answer!",
      "Wrong explain!",
      "Wrong both answer and explain!",
    ];
  }, []);

  const handleFeedback = useCallback(async (feedback: string) => {
    try {
      const loadingId = toast.loading("Sending feedback!");
      const res = await ModelApi.ratingConversationContent(data._id, feedback);
      toast.remove(loadingId);
      toast.success(res.data?.message && "Thank you for your feedback!");
    } catch (error: any) {
      toast.error(error?.message && "Fail to send feedback, please try again!");
    } finally {
      setShow(false);
      setBad(false);
    }
  }, []);

  const handleBadResponse = useCallback(() => {
    setBad(true);
  }, []);

  if (data.type === "ask") {
    return (
      <div className="flex flex-row px-[20px] pt-[30px] items-start gap-2  w-full">
        <Image
          src={DefaultAvatarIcon}
          alt="Logo"
          className="w-[40px] h-[40px] rounded-full"
        />
        <div className=" flex flex-col gap-4 mt-[7px] w-full">
          <span className="font-sans font-medium text-black text-base">
            {user?.name || "Customer"}
          </span>
          <div className="flex flex-col mt-[5px] gap-2">
            <p className="font-sans font-semibold text-black text-xl mb-[10px]">
              {data.question}
            </p>
            {data.answers.map((ans) => (
              <p className="font-sans text-black text-base px-[20px]">{ans}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const title = useMemo(() => {
    switch (data.version) {
      case 1:
        return "QWEN";
      case 2:
        return "BLOOMZ";
      case 3:
        return "LLAMA";

      default:
        return "";
    }
  }, [data.version]);
  return (
    <div
      className="flex flex-row px-[20px] pt-[30px] items-start gap-2 w-full"
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      <div className="rounded-full min-w-[40px] h-[40px] bg-gray-200 border border-gray-200 flex items-center justify-center">
        <Image src={SmallLogoIcon} alt="Logo" className="w-[20px] h-[20px]" />
      </div>
      <div className=" flex flex-col gap-4 mt-[7px] w-full">
        <span className="font-sans font-medium text-black text-base">
          HistoryQuiz {title}
        </span>
        <div className="flex flex-col mt-[5px] gap-2">
          <p className="font-sans font-semibold text-black text-xl mb-[10px]">
            Answer:{" "}
            {data.correct_answer === "" ? "Not Found" : data.correct_answer}
          </p>
          <p className="font-sans text-black text-base">
            <span className="font-semibold text-xl">Explain:</span>{" "}
            {data.explanation === "" ? "Not Found" : data.explanation}
          </p>
          <p className="font-sans text-black text-base">
            <span className="font-semibold text-xl">Reference:</span>{" "}
            {data.top_k.length === 0
              ? "Câu hỏi không nằm trong cơ sở tri thức được cung cấp"
              : data.top_k
                  .map(
                    (ref: string) =>
                      `Sách giáo khoa lịch sử lớp ${ref.split("_")[0]} bài ${
                        ref.split("_")[1]
                      }; `
                  )
                  .join("")}
          </p>
        </div>
        <div className="flex flex-row h-[30px]">
          {show && (
            <Image
              alt="DisLikeIcon"
              src={DisLikeIcon}
              title="Bad response"
              className="w-[20px] h-[20px] cursor-pointer bg-white"
              onClick={handleBadResponse}
            />
          )}
        </div>
        {bad && (
          <div className="p-[15px] border border-black rounded-[10px]">
            <div className="w-full flex flex-row justify-between pb-5 items-center">
              <span className="text-gray-500 font-sans text-base">
                Tell us more:
              </span>
              <span
                className="text-gray-600 font-sans text-base cursor-pointer hover:text-gray-800 p-1"
                onClick={() => {
                  setBad(false);
                }}
              >
                X
              </span>
            </div>
            <div className="w-full flex flex-row flex-wrap gap-5">
              {feedbackList.map((data) => (
                <div
                  className="px-[12px] py-[4px] text-sm font-sans text-gray-500 cursor-pointer border border-gray-500 rounded-[8px] hover:text-gray-800 hover:border-gray-800"
                  onClick={() => {
                    handleFeedback(data);
                  }}
                >
                  {data}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentQuiz;
