import {h, Fragment} from 'preact';
import {useState, useRef, useEffect, useCallback} from 'preact/hooks';
import register from 'preact-custom-element';
import {fromEvent} from 'rxjs';
import {map, skipWhile, debounceTime} from 'rxjs/operators';
import {post} from '../../utils/post';
import {useEventListener} from '../../utils/useEventListener';

const InputField = () => {
  const [text, setText] = useState('');
  const [recom, setRecom] = useState('');
  const inputField = useRef<any>(null);

  const handler = useCallback(
    (event: any) => {
      // console.log(event);
      if (event.ctrlKey) {
        inputField.current.textContent = inputField.current.textContent;
        setCaret();
      }
      setRecom('');
      // key == 'Tab' && setText(recom);
      // Update coordinates
    },
    [recom, text],
  );

  useEventListener('keydown', handler);

  const EventObservable = useCallback(
    (ref: any) =>
      fromEvent(ref, 'input').pipe(
        debounceTime(500),
        // extract value from event input
        map((val: any) => val.srcElement.innerHTML),
        skipWhile((value: any) => value.slice(-1) === '&nbsp;'),
        map((val: any) => val.replace('&nbsp;', ' ')),
      ),
    [],
  );
  const setCaret = () => {
    const el: any = document.getElementById('edit');
    const range: any = document.createRange();
    const sel: any = window.getSelection();
    console.log(el.childNodes);
    range.setStart(el.childNodes[0], el.childNodes[el.childNodes.length - 1].wholeText.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  };

  useEffect(() => {
    const inputEvent = EventObservable(inputField.current).subscribe(async (inputValue: any) => {
      // setText(inputValue);
      const response = await post('http://localhost:8080/predict', {text: inputValue});
      // const response = {text: 'Damen und Herren'};
      setRecom(response.text.replace(inputValue, ''));
    });

    return () => {
      inputEvent.unsubscribe();
    };
  }, [recom, text]);

  return (
    <Fragment>
      <div class="max-w-xl m-auto">
        <h2>
          Press <code>ctrl+space</code> to accept autosuggest
        </h2>
        <div
          id="edit"
          //@ts-ignore
          contenteditable={'true'}
          class="bg-gray-200	block w-full pl-7 pr-12 sm:text-sm sm:leading-5 h-16"
          ref={inputField}
        >
          {text}
          {recom !== '' && <span class="text-gray-600">{recom}</span>}
        </div>
      </div>
    </Fragment>
  );
};

register(InputField, 'x-gpt');
