import { FiHelpCircle } from "react-icons/fi";
import Tooltip from "@material-ui/core/Tooltip";

const HelpIcon = (props) => {
  return (
    <Tooltip title={props.title} placement={props.placement}>
      <span className="help-icon">
        <FiHelpCircle />
      </span>
    </Tooltip>
  );
};

export default HelpIcon;
