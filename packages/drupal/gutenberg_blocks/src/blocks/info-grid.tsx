import { InnerBlocks } from "wordpress__block-editor";
import { registerBlockType } from "wordpress__blocks";
import { useSelect } from 'wordpress__data';


// @ts-ignore
const { t: __ } = Drupal;

const MAX_BLOCKS: number = 3;

registerBlockType("custom/info-grid", {
  title: __("Info Grid"),
  icon: "editor-insertmore",
  category: "layout",
  attributes: {},
  edit: (props) => {
    const { blockCount } = useSelect((select) => ({
      blockCount: select('core/block-editor').getBlockCount(props.clientId),
    }));    return (
      <div className={"container-wrapper"}>
        <div className={"container-label"}>{__("Info Grid")}</div>
        <InnerBlocks
          templateLock={false}
          renderAppender={() => {
            if (blockCount >= MAX_BLOCKS) {
              return null;
            } else {
              return <InnerBlocks.ButtonBlockAppender />;
            }
          }}
          allowedBlocks={["custom/info-grid-item"]}
          template={[]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />
});
