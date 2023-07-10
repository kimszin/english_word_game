import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styled from "styled-components";

const ColorBox = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: ${(props) => props.background};
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const description = {
  game: {
    title: "게임 설명",
    desc: () => (
      <span>
        - 5글자의 영단어를 6번의 기회 안에 찾으세요. <br />- 단어는 명사, 동사,
        형용사, 부사를 포함합니다. <br /> (또한 기업명, 국가명, 도시명도
        있습니다.) <br /> - 색상박스를 클릭하면 색상의 의미를 알 수 있습니다.{" "}
        <br /> - 한 게임이 끝날때마다 정답, 통계를 볼 수 있습니다.
      </span>
    ),
  },
  redButton: {
    title: "빨간색 상자",
    desc: () => <span>"해당 철자는 단어에 포함되어 있지 않습니다."</span>,
  },
  yellowButton: {
    title: "주황색 상자",
    desc: () => (
      <span>"해당 철자는 단어에 포함되어 있지만 순서가 틀립니다."</span>
    ),
  },
  greenButton: {
    title: "초록색 상자",
    desc: () => (
      <span>"해당 철자는 단어에 포함되어 있고 순서도 맞습니다."</span>
    ),
  },
};

const colorRGB = {
  redButton: "#e96f6f",
  yellowButton: "#f3bc06",
  greenButton: "#3db90a",
};

export default function BasicModal({ modalType }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {modalType === "game" ? (
        <div className="title" onClick={handleOpen}>
          WordFit
        </div>
      ) : (
        <ColorBox background={colorRGB[modalType]} onClick={handleOpen} />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {description[modalType].title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {description[modalType].desc()}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
