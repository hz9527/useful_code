<template lang="html">
    <div class="page">
      <div class="hz-title">生成一个10位的包含0-9a-z的字符串  
Number.toString(n) n为进制

</div>
      <pre v-hz-pre>
        <code class="js">
          
Math.random().toString(36).slice(2) // 0zx12ds80xq

        </code>
      </pre>
    </div>
  </template>