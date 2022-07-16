import classnames from 'classnames';

type Element = string;
type Modifiers = string | Array<string | object>;
type ClassNames = string | object | Array<string | object>;

export type BemFunction = (element?: Element, modifiers?: Modifiers, classNames?: ClassNames) => string;

export default function bemBlock(blockName: string, prefix = ``): BemFunction {
  return function bem(element?, modifiers?, classNames?): string {
    const block = `${prefix}${blockName}`;

    const blockElement = element ? `${block}__${element}` : block;
    const blockModifiers = modifiers
      ? Array.isArray(modifiers)
        ? classnames(
            modifiers
              .filter(m => m)
              .map(m => {
                if (typeof m === 'string') {
                  return `${blockElement}--${m}`;
                } else {
                  const key = Object.keys(m)[0];
                  return { [`${blockElement}--${key}`]: m[key] };
                }
              })
          )
        : `${blockElement}--${modifiers}`
      : '';

    if (classNames) {
      if (Array.isArray(classNames)) {
        return classnames([blockElement, blockModifiers, ...classNames]);
      } else {
        return classnames([blockElement, blockModifiers, classNames]);
      }
    } else {
      return classnames([blockElement, blockModifiers]);
    }
  };
}

export type BemHookReturnType = {
  className: ReturnType<BemFunction>;
};

export function useBem(...bemBlockArgs: Parameters<typeof bemBlock>): (
  ...bemFunctionArgs: Parameters<BemFunction>
) => BemHookReturnType {
  const bem = bemBlock(...bemBlockArgs);
  return function (...bemFunctionArgs) {
    return {
      className: bem(...bemFunctionArgs),
    };
  };
}
