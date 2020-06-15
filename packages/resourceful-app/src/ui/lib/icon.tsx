import React from 'react'

import {
  Resource,
  Maybe,
  ResourceType,
  PlainObject,
  FileResource,
} from '../../lib'

import VScodeIcon from '../svg/icons/vscode.svg'
import PDFIcon from '../svg/icons/adobe.svg'
import SafariIcon from '../svg/icons/safari.svg'
import DocumentIcon from '../svg/icons/document.svg'
import PSDIcon from '../svg/icons/adobe-photoshop.svg'
import AIIcon from '../svg/icons/adobe-illustrator.svg'
import InddIcon from '../svg/icons/adobe-indesign.svg'
import FolderIcon from '../svg/icons/folder.svg'
import ImageIcon from '../svg/icons/image.svg'

const ExtToSvg: PlainObject<JSX.Element> = {
  '.code-workspace': <VScodeIcon width={null} height={null} />,
  '.pdf': <PDFIcon width={null} height={null} />,
  '.psd': <PSDIcon />,
  '.ai': <AIIcon />,
  '.eps': <AIIcon />,
  '.indd': <InddIcon />,
}

export function getExtension(file: string): Maybe<string> {
  const m = file.match(/(\..+?)$/i)

  if (m) {
    return m[1]
  }

  return undefined
}

function getIcon(file: string): Maybe<JSX.Element> {
  const ext = getExtension(file)
  if (ext) {
    return ExtToSvg[ext]
  }

  return undefined
}

export function getIconForResource(r: Resource): Maybe<JSX.Element> {
  switch (r.type) {
    case ResourceType.Url: {
      return <SafariIcon />
    }

    case ResourceType.File: {
      if (r.contentType === 'directory') {
        return <FolderIcon />
      }

      if (r.contentType?.startsWith('image/')) {
        return <ImageIcon />
      }

      return getIcon((r as FileResource).path) ?? <DocumentIcon />
    }

    default:
      return undefined
  }
}
