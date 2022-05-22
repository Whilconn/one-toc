export function TocStyles(top) {
  const ellipsis = `text-overflow: ellipsis;overflow: hidden;white-space: nowrap;`;
  return `<style>
        .toc-container, .toc-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            line-height: initial;
        }

        .toc-container {
            position: fixed;
            width: 260px;
            top: ${top}px;
            right: 20px;
            font-size: 14px;
            border-radius: 5px;
            background: #fff;
            box-shadow: 0 0 2px 0 #ccc;
            z-index: 9999;
        }

        .toc-container .hidden {
            display: none;
        }

        .toc-title {
            padding: 15px;
            border-bottom: 1px solid #e4e6eb;
            font-weight: bold;
            ${ellipsis}
        }

        .toc-body {
            padding: 15px;
            max-height: calc(100vh - ${top}px - 100px);
            overflow: auto;
        }

        .toc-body a {
            display: block;
            padding: 8px 0;
            color: #333;
            ${ellipsis}
        }

        .toc-body a:hover {
            color: #007fff;
        }

        .toc-body a.active {
            color: #007fff;
            font-weight: bold;
        }

        .toc-footer {
            padding: 5px;
            text-align: center;
            color: #007fff;
            cursor: pointer;
            border-top: 1px solid #e4e6eb;
        }
    </style>`;
}
