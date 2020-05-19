import {h, Fragment} from 'preact';
import {useState, useRef, useEffect, useCallback} from 'preact/hooks';
import register from 'preact-custom-element';
import {fromEvent} from 'rxjs';
import {map, skipWhile, debounceTime} from 'rxjs/operators';
import {post} from '../../utils/post';
import {useEventListener} from '../../utils/useEventListener';
const InputField = () => {
  const [text, setText] = useState('Sehr geehrte');
  const [recom, setRecom] = useState('');
  const [positionXY, setPositionXY]: any = useState({});
  const inputField = useRef<any>(null);

  const handler = useCallback(
    (event: any) => {
      if (event.ctrlKey && event.keyCode === 32) {
        setText(recom);
      }
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
        map((val: any) => {
          return {value: val.srcElement.value as string, position: val.srcElement.selectionStart};
        }),
        // skipWhile((element: any) => element.value.slice(-1) !== ' '),
      ),
    [],
  );
  // useEffect(() => {
  //   const {x, y} = inputField.current.getBoundingClientRect();
  //   setPositionXY({x, y});
  // });

  useEffect(() => {
    const inputEvent = EventObservable(inputField.current).subscribe(async (inputValue) => {
      // setPositionXY({...positionXY, x: inputValue.position});
      const response = await post('http://localhost:8080/predict', {text: inputValue.value});
      setText(inputValue.value);
      setRecom(response.text);
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
        <textarea
          rows={10}
          class="bg-gray-200	block w-full pl-7 pr-12 sm:text-sm sm:leading-5"
          value={text}
          ref={inputField}
        ></textarea>
        {recom !== '' && (
          <span
            class="text-gray-600 bg-gray-100  px-2 rounded-full"
            style={{position: 'absolute', left: positionXY.x + 95, top: positionXY.y}}
          >
            {recom} ⨉
          </span>
        )}
      </div>
    </Fragment>
  );
};

register(InputField, 'x-input');
