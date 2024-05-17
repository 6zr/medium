#!/bin/bash

CHARACTER_READ=$1
CHARACTER_DIR=$1

# rm -rf ./${CHARACTER_DIR}
# mkdir ./${CHARACTER_DIR}

KEY=52

QUERY=`curl -s -H "Content-Type: application/json" -j POST "127.0.0.1:50021/sing_frame_audio_query?speaker=6000" -d @- <<EOS
{ "notes": [ { "key": null, "frame_length": 0, "lyric": "" }, { "key": ${KEY}, "frame_length": 60, "lyric": "${CHARACTER_READ}" } ] }
EOS`
curl -s -H "Content-Type: application/json" -X POST "127.0.0.1:50021/frame_synthesis?speaker=3001" -d @- > ./${CHARACTER_DIR}${KEY}.wav <<EOS
${QUERY}
EOS

KEY=57

QUERY=`curl -s -H "Content-Type: application/json" -j POST "127.0.0.1:50021/sing_frame_audio_query?speaker=6000" -d @- <<EOS
{ "notes": [ { "key": null, "frame_length": 0, "lyric": "" }, { "key": ${KEY}, "frame_length": 60, "lyric": "${CHARACTER_READ}" } ] }
EOS`
curl -s -H "Content-Type: application/json" -X POST "127.0.0.1:50021/frame_synthesis?speaker=3001" -d @- > ./${CHARACTER_DIR}${KEY}.wav <<EOS
${QUERY}
EOS

KEY=64

QUERY=`curl -s -H "Content-Type: application/json" -j POST "127.0.0.1:50021/sing_frame_audio_query?speaker=6000" -d @- <<EOS
{ "notes": [ { "key": null, "frame_length": 0, "lyric": "" }, { "key": ${KEY}, "frame_length": 60, "lyric": "${CHARACTER_READ}" } ] }
EOS`
curl -s -H "Content-Type: application/json" -X POST "127.0.0.1:50021/frame_synthesis?speaker=3001" -d @- > ./${CHARACTER_DIR}${KEY}.wav <<EOS
${QUERY}
EOS

KEY=69

QUERY=`curl -s -H "Content-Type: application/json" -j POST "127.0.0.1:50021/sing_frame_audio_query?speaker=6000" -d @- <<EOS
{ "notes": [ { "key": null, "frame_length": 0, "lyric": "" }, { "key": ${KEY}, "frame_length": 60, "lyric": "${CHARACTER_READ}" } ] }
EOS`
curl -s -H "Content-Type: application/json" -X POST "127.0.0.1:50021/frame_synthesis?speaker=3001" -d @- > ./${CHARACTER_DIR}${KEY}.wav <<EOS
${QUERY}
EOS

KEY=76

QUERY=`curl -s -H "Content-Type: application/json" -j POST "127.0.0.1:50021/sing_frame_audio_query?speaker=6000" -d @- <<EOS
{ "notes": [ { "key": null, "frame_length": 0, "lyric": "" }, { "key": ${KEY}, "frame_length": 60, "lyric": "${CHARACTER_READ}" } ] }
EOS`
curl -s -H "Content-Type: application/json" -X POST "127.0.0.1:50021/frame_synthesis?speaker=3001" -d @- > ./${CHARACTER_DIR}${KEY}.wav <<EOS
${QUERY}
EOS

