import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Layout, Select, Input } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { ModelApi } from "@/services/api/model.api";
import { useRouter } from "next/router";

const { Sider, Content } = Layout;

const Graph: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [htmlLink, setHtmlLink] = useState("");
  const [type, setType] = useState<string>("L");
  const [grade, setGrade] = useState<string>("10");
  const [lessons, setLessons] = useState<string>("");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const data = {
        dataset: type,
        grade: grade,
        lesson: lessons,
      };

      const response = await ModelApi.getGraphByCustomer(data);
      // setHtmlLink(baseURL + "/" + response?.data.graph);

      setHtmlLink(" http://127.0.0.1:3001" + "/" + response?.data.graph);

      console.log(htmlLink);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    // Create a blob URL for the HTML content
    // const htmlPath = "./graph_11_all.html"; // Adjust this path to your file location
    // const htmlPath = "./graph_10_1.html"; // Adjust this path to your file location

    // Load the HTML file
    if (htmlLink) {
      fetch(htmlLink)
        .then((response) => response.text())
        .then((content) => {
          if (iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc) {
              iframeDoc.open();
              iframeDoc.write(content);
              iframeDoc.close();
            }
          }
        })
        .catch((error) => console.error("Error loading HTML:", error));
    }
  }, [htmlLink]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: "100%",
            height: 64,
            color: "white",
          }}
        />
        <div style={{ padding: "16px" }}>
          <Button
            type="primary"
            style={{ width: "100%", marginBottom: "16px" }}
            onClick={() => router.push("/")}
          >
            H
          </Button>
          <Select
            style={{ width: "100%", marginBottom: "16px" }}
            placeholder="Select type"
            defaultValue="L"
            value={type}
            onChange={(value) => setType(value)}
            options={[
              { value: "Q", label: "Q" },
              { value: "L", label: "L" },
            ]}
          />
          <Select
            placeholder="Grade"
            style={{ width: "100%", marginBottom: "16px" }}
            value={grade}
            defaultValue="10"
            onChange={(value) => setGrade(value)}
            options={[
              { value: "10", label: "10" },
              { value: "11", label: "11" },
              { value: "12", label: "12" },
            ]}
          />
          <Input
            placeholder="Lessons"
            style={{ marginBottom: "16px" }}
            value={lessons}
            onChange={(e) => setLessons(e.target.value)}
          />
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            overflow: "auto",
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              width: "100%",
              height: "800px",
              border: "none",
            }}
            title="Network Graph"
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Graph;
