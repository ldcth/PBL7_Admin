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
            <span className="font-semibold text-xl">Reference:</span>
            <ul>
              {data.top_k.slice(0, 5).map((ref: string, index: number) => (
                <li key={`${ref}-${index}`}>
                  {index + 1}. Sách giáo khoa lịch sử lớp {ref.split("_")[0]}{" "}
                  bài {ref.split("_")[1]}
                </li>
              ))}
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentQuiz;
